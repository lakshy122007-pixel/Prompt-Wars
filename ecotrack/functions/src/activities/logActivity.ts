import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { activitySchema, calculateActivityCo2e } from '@ecotrack/shared';

// Helper function to update daily summary for a specific date
export async function updateDailySummary(db: FirebaseFirestore.Firestore, uid: string, dateStr: string) {
  // Parse date range for the day (00:00:00 to 23:59:59 UTC/local)
  // To avoid time zone issues, activities have a `loggedAt` field stored as a Timestamp.
  // We want to query activities where loggedAt is on that ISO date string (YYYY-MM-DD)
  const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

  const activitiesSnapshot = await db.collection('users').doc(uid).collection('activities')
    .where('loggedAt', '>=', startOfDay)
    .where('loggedAt', '<=', endOfDay)
    .get();

  let totalCo2eKg = 0;
  const byCategory = {
    transport: 0,
    energy: 0,
    food: 0,
    waste: 0,
    water: 0
  };

  activitiesSnapshot.forEach(doc => {
    const act = doc.data();
    const cat = act.category as keyof typeof byCategory;
    const co2e = act.co2eKg || 0;
    if (byCategory[cat] !== undefined) {
      byCategory[cat] += co2e;
      totalCo2eKg += co2e;
    }
  });

  // Write daily summary
  await db.collection('users').doc(uid).collection('dailySummaries').doc(dateStr).set({
    date: dateStr,
    totalCo2eKg: Number(totalCo2eKg.toFixed(4)),
    byCategory: {
      transport: Number(byCategory.transport.toFixed(4)),
      energy: Number(byCategory.energy.toFixed(4)),
      food: Number(byCategory.food.toFixed(4)),
      waste: Number(byCategory.waste.toFixed(4)),
      water: Number(byCategory.water.toFixed(4))
    },
    computedAt: FieldValue.serverTimestamp()
  });
}

export const logActivity = onCall(async (request) => {
  const { auth, data } = request;
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to log an activity.');
  }

  const uid = auth.uid;

  // 1. Validate incoming activity data
  const parsed = activitySchema.safeParse(data);
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', 'Invalid activity details: ' + parsed.error.message);
  }

  const { category, subtype, quantity, loggedAt, notes } = parsed.data;

  // 2. Perform authoritative CO2e calculations
  let calculation;
  try {
    calculation = calculateActivityCo2e({ category, subtype, quantity });
  } catch (err: any) {
    throw new HttpsError('invalid-argument', err.message || 'Emissions calculation failed');
  }

  const db = getFirestore();
  const activityId = db.collection('users').doc(uid).collection('activities').doc().id;

  const activityData = {
    id: activityId,
    userId: uid,
    category,
    subtype,
    quantity,
    unit: data.unit || '', // Keep consistent with requested client units if passed
    co2eKg: calculation.co2eKg,
    loggedAt,
    createdAt: FieldValue.serverTimestamp(),
    notes: notes || null
  };

  // 3. Save to Firestore
  await db.collection('users').doc(uid).collection('activities').doc(activityId).set(activityData);

  // 4. Update the daily summary for this specific date
  // We extract YYYY-MM-DD from loggedAt string/date representation
  const dateStr = new Date(loggedAt).toISOString().split('T')[0];
  await updateDailySummary(db, uid, dateStr);

  return {
    activityId,
    co2eKg: calculation.co2eKg
  };
});
