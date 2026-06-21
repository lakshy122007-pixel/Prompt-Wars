import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export const sendWeeklyDigest = onSchedule('0 0 * * 0', async (event) => {
  const db = getFirestore();
  const usersSnapshot = await db.collection('users').where('weeklyDigestEnabled', '==', true).get();
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const promises: Promise<any>[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const uid = userDoc.id;
    const userData = userDoc.data();
    const email = userData.email;

    if (!email) continue;

    // Gather daily summaries for past 7 days
    const dailyRef = db.collection('users').doc(uid).collection('dailySummaries')
      .where('date', '>=', sevenDaysAgo.toISOString().split('T')[0]);

    const dailySnapshot = await dailyRef.get();
    let totalWeeklyCo2e = 0;
    const byCategory: Record<string, number> = { transport: 0, energy: 0, food: 0, waste: 0, water: 0 };

    dailySnapshot.forEach(doc => {
      const data = doc.data();
      totalWeeklyCo2e += data.totalCo2eKg || 0;
      const categories = data.byCategory || {};
      for (const cat in categories) {
        if (byCategory[cat] !== undefined) {
          byCategory[cat] += categories[cat];
        }
      }
    });

    // Find top emitting category
    let topCategory = 'None';
    let maxEmissions = -1;
    for (const cat in byCategory) {
      if (byCategory[cat] > maxEmissions) {
        maxEmissions = byCategory[cat];
        topCategory = cat;
      }
    }

    // Compile email message
    const emailSubject = `Your EcoTrack Weekly Carbon Digest`;
    const emailBody = `
Hello ${userData.displayName || 'EcoTracker'},

Here is your weekly carbon footprint summary:

Total Carbon Footprint: ${totalWeeklyCo2e.toFixed(2)} kg CO2e
Top Emitting Category: ${topCategory.toUpperCase()} (${byCategory[topCategory]?.toFixed(2) || 0} kg CO2e)

Category Breakdown:
- Transport: ${byCategory.transport.toFixed(2)} kg CO2e
- Energy: ${byCategory.energy.toFixed(2)} kg CO2e
- Food: ${byCategory.food.toFixed(2)} kg CO2e
- Waste: ${byCategory.waste.toFixed(2)} kg CO2e
- Water: ${byCategory.water.toFixed(2)} kg CO2e

Tip of the Week: Keep tracking and check the Tips section on EcoTrack for personalized ways to reduce your emissions!

Best regards,
The EcoTrack Team
    `;

    console.log(`[WEEKLY DIGEST SENT TO ${email}]: Total Weekly CO2e: ${totalWeeklyCo2e} kg`);

    // Write to a 'mail' collection (Trigger Email extension pattern)
    promises.push(
      db.collection('mail').add({
        to: email,
        message: {
          subject: emailSubject,
          text: emailBody,
          html: emailBody.replace(/\n/g, '<br>')
        },
        userId: uid,
        createdAt: FieldValue.serverTimestamp()
      })
    );
  }

  await Promise.all(promises);
  console.log(`Successfully queued weekly digests for ${usersSnapshot.size} users.`);
});
