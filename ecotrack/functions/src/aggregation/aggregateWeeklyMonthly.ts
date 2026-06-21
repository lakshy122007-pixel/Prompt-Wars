import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Helper to get ISO Week number
function getISOWeekString(date: Date): string {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${target.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// Helper to update weekly and monthly summaries
export async function updateWeeklyMonthlySummaries(db: FirebaseFirestore.Firestore, uid: string) {
  // Query all daily summaries for the user (we could optimize for recent but since it's a scheduler, we can roll up)
  const dailySnapshot = await db.collection('users').doc(uid).collection('dailySummaries').get();
  
  const weeklyTotals: Record<string, { totalCo2eKg: number; byCategory: Record<string, number> }> = {};
  const monthlyTotals: Record<string, { totalCo2eKg: number; byCategory: Record<string, number> }> = {};

  dailySnapshot.forEach(doc => {
    const data = doc.data();
    const dateStr = data.date; // YYYY-MM-DD
    const total = data.totalCo2eKg || 0;
    const byCategory = data.byCategory || {};

    const date = new Date(`${dateStr}T00:00:00.000Z`);
    
    // Weekly key
    const weekKey = getISOWeekString(date);
    if (!weeklyTotals[weekKey]) {
      weeklyTotals[weekKey] = { totalCo2eKg: 0, byCategory: { transport: 0, energy: 0, food: 0, waste: 0, water: 0 } };
    }
    weeklyTotals[weekKey].totalCo2eKg += total;
    for (const cat in byCategory) {
      if (weeklyTotals[weekKey].byCategory[cat] !== undefined) {
        weeklyTotals[weekKey].byCategory[cat] += byCategory[cat];
      }
    }

    // Monthly key (YYYY-MM)
    const monthKey = dateStr.substring(0, 7);
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = { totalCo2eKg: 0, byCategory: { transport: 0, energy: 0, food: 0, waste: 0, water: 0 } };
    }
    monthlyTotals[monthKey].totalCo2eKg += total;
    for (const cat in byCategory) {
      if (monthlyTotals[monthKey].byCategory[cat] !== undefined) {
        monthlyTotals[monthKey].byCategory[cat] += byCategory[cat];
      }
    }
  });

  const batch = db.batch();

  // Save weekly summaries
  for (const weekKey in weeklyTotals) {
    const ref = db.collection('users').doc(uid).collection('weeklySummaries').doc(weekKey);
    const data = weeklyTotals[weekKey];
    batch.set(ref, {
      week: weekKey,
      totalCo2eKg: Number(data.totalCo2eKg.toFixed(4)),
      byCategory: {
        transport: Number(data.byCategory.transport.toFixed(4)),
        energy: Number(data.byCategory.energy.toFixed(4)),
        food: Number(data.byCategory.food.toFixed(4)),
        waste: Number(data.byCategory.waste.toFixed(4)),
        water: Number(data.byCategory.water.toFixed(4))
      },
      computedAt: FieldValue.serverTimestamp()
    });
  }

  // Save monthly summaries
  for (const monthKey in monthlyTotals) {
    const ref = db.collection('users').doc(uid).collection('monthlySummaries').doc(monthKey);
    const data = monthlyTotals[monthKey];
    batch.set(ref, {
      month: monthKey,
      totalCo2eKg: Number(data.totalCo2eKg.toFixed(4)),
      byCategory: {
        transport: Number(data.byCategory.transport.toFixed(4)),
        energy: Number(data.byCategory.energy.toFixed(4)),
        food: Number(data.byCategory.food.toFixed(4)),
        waste: Number(data.byCategory.waste.toFixed(4)),
        water: Number(data.byCategory.water.toFixed(4))
      },
      computedAt: FieldValue.serverTimestamp()
    });
  }

  await batch.commit();
}

export const aggregateWeeklyMonthly = onSchedule('0 3 * * *', async (event) => {
  const db = getFirestore();
  const usersSnapshot = await db.collection('users').get();
  
  for (const userDoc of usersSnapshot.docs) {
    await updateWeeklyMonthlySummaries(db, userDoc.id);
  }
  console.log(`Successfully completed weekly and monthly summaries aggregation for ${usersSnapshot.size} users.`);
});
