import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import * as crypto from 'crypto';

export const deleteUserAccount = onCall(async (request) => {
  const { auth, data } = request;
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to delete their account.');
  }

  const uid = auth.uid;
  const { confirmationPhrase } = data;

  const expectedPhrase = 'DELETE MY ACCOUNT';
  if (confirmationPhrase !== expectedPhrase) {
    throw new HttpsError('invalid-argument', `Confirmation phrase must match "${expectedPhrase}" exactly.`);
  }

  const db = getFirestore();
  const userRef = db.collection('users').doc(uid);

  try {
    // 1. Delete Firestore user collections in batches
    const collections = ['activities', 'dailySummaries', 'weeklySummaries', 'monthlySummaries', 'goals'];
    for (const colName of collections) {
      const colRef = userRef.collection(colName);
      const snapshot = await colRef.get();
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // 2. Delete community leaderboard rank if exists
    const leaderboardRef = db.collection('community').doc('leaderboard').collection('members').doc(uid);
    await leaderboardRef.delete();

    // 3. Delete user document users/{uid}
    await userRef.delete();

    // 4. Delete user files from Storage (under users/{uid}/)
    const bucket = getStorage().bucket();
    try {
      await bucket.deleteFiles({ prefix: `users/${uid}/` });
    } catch (storageErr: any) {
      console.warn(`Warning: failed to delete storage files for ${uid} (may be empty): ${storageErr.message}`);
    }

    // 5. Delete Firebase Auth user record
    await getAuth().deleteUser(uid);

    // 6. Log deletion event (UID hash only for GDPR compliance, no PII)
    const uidHash = crypto.createHash('sha256').update(uid).digest('hex');
    console.log(`[AUDIT] User account deleted. UID Hash: ${uidHash}`);

    return { success: true };
  } catch (err: any) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError('internal', 'An error occurred during account deletion: ' + err.message);
  }
});
