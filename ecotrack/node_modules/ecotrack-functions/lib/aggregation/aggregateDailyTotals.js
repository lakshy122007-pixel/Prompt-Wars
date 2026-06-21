import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';
import { updateDailySummary } from '../activities/logActivity.js';
export const aggregateDailyTotals = onSchedule('0 2 * * *', async (event) => {
    const db = getFirestore();
    const usersSnapshot = await db.collection('users').get();
    // To handle late logging and ensure data accuracy, we re-aggregate the last 3 days
    const today = new Date();
    const datesToAggregate = [];
    for (let i = 0; i < 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        datesToAggregate.push(d.toISOString().split('T')[0]);
    }
    const promises = [];
    usersSnapshot.forEach(userDoc => {
        const uid = userDoc.id;
        for (const dateStr of datesToAggregate) {
            promises.push(updateDailySummary(db, uid, dateStr));
        }
    });
    await Promise.all(promises);
    console.log(`Successfully completed daily aggregations for ${usersSnapshot.size} users over dates: ${datesToAggregate.join(', ')}`);
});
