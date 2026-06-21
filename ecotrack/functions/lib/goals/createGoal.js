import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { goalSchema } from '@ecotrack/shared';
export const createGoal = onCall(async (request) => {
    const { auth, data } = request;
    if (!auth) {
        throw new HttpsError('unauthenticated', 'User must be authenticated to create a goal.');
    }
    const uid = auth.uid;
    // 1. Validate inputs
    const parsed = goalSchema.safeParse(data);
    if (!parsed.success) {
        throw new HttpsError('invalid-argument', 'Invalid goal details: ' + parsed.error.message);
    }
    const { category, type, targetValue, targetDate } = parsed.data;
    const db = getFirestore();
    // 2. Auto-compute baselineValue from the last 30 days of user activities
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let activitiesQuery = db.collection('users').doc(uid).collection('activities')
        .where('loggedAt', '>=', thirtyDaysAgo);
    if (category !== 'overall') {
        activitiesQuery = activitiesQuery.where('category', '==', category);
    }
    const snapshot = await activitiesQuery.get();
    let baselineValue = 0;
    snapshot.forEach(doc => {
        const act = doc.data();
        baselineValue += act.co2eKg || 0;
    });
    // Round baseline to 4 decimals
    baselineValue = Number(baselineValue.toFixed(4));
    const goalId = db.collection('users').doc(uid).collection('goals').doc().id;
    const goalData = {
        id: goalId,
        category,
        type,
        targetValue,
        baselineValue,
        startDate: FieldValue.serverTimestamp(),
        targetDate,
        status: 'active',
        createdAt: FieldValue.serverTimestamp()
    };
    // 3. Save goal
    await db.collection('users').doc(uid).collection('goals').doc(goalId).set(goalData);
    return { goalId };
});
