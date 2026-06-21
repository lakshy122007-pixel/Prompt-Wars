import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export const exportUserData = onCall(async (request) => {
  const { auth, data } = request;
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = auth.uid;
  const { format } = data; // 'csv' | 'pdf'

  if (format !== 'csv' && format !== 'pdf') {
    throw new HttpsError('invalid-argument', 'Format must be "csv" or "pdf"');
  }

  const db = getFirestore();
  const userRef = db.collection('users').doc(uid);

  // 1. Rate limiting check (max 3/hour/user)
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User profile not found');
  }

  const userData = userDoc.data() || {};
  const exportTimes: Timestamp[] = userData.exportTimes || [];
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const activeExports = exportTimes.filter(t => t.toMillis() > oneHourAgo);

  if (activeExports.length >= 3) {
    throw new HttpsError('resource-exhausted', 'Export limit exceeded. Max 3 exports per hour allowed.');
  }

  // Update export tracking array
  activeExports.push(Timestamp.now());
  await userRef.update({ exportTimes: activeExports });

  // 2. Fetch User Data
  const activitiesSnapshot = await userRef.collection('activities').orderBy('loggedAt', 'desc').get();
  const goalsSnapshot = await userRef.collection('goals').orderBy('createdAt', 'desc').get();

  const activities: any[] = [];
  activitiesSnapshot.forEach(doc => activities.push(doc.data()));

  const goals: any[] = [];
  goalsSnapshot.forEach(doc => goals.push(doc.data()));

  // 3. Generate File Content
  let fileContent = '';
  let contentType = '';

  if (format === 'csv') {
    contentType = 'text/csv';
    // Generate CSV
    const headers = 'Type,Category,Subtype,Quantity,CO2e (kg),Date,Notes\n';
    const activityLines = activities.map(act => 
      `Activity,${act.category},${act.subtype},${act.quantity},${act.co2eKg},${new Date(act.loggedAt.toMillis ? act.loggedAt.toMillis() : act.loggedAt).toISOString()},"${(act.notes || '').replace(/"/g, '""')}"`
    ).join('\n');
    const goalLines = goals.map(g => 
      `Goal,${g.category},${g.type},${g.targetValue},baseline:${g.baselineValue},${new Date(g.targetDate.toMillis ? g.targetDate.toMillis() : g.targetDate).toISOString()},status:${g.status}`
    ).join('\n');
    fileContent = headers + activityLines + '\n' + goalLines;
  } else {
    contentType = 'text/plain'; // Simple plain-text PDF equivalent report for stub
    fileContent = `ECOTRACK USER REPORT\n`;
    fileContent += `====================\n`;
    fileContent += `User ID: ${uid}\n`;
    fileContent += `Display Name: ${userData.displayName || ''}\n`;
    fileContent += `Email: ${userData.email || ''}\n\n`;
    fileContent += `ACTIVITIES LOGGED:\n`;
    activities.forEach(act => {
      const dateStr = new Date(act.loggedAt.toMillis ? act.loggedAt.toMillis() : act.loggedAt).toLocaleDateString();
      fileContent += `- [${dateStr}] ${act.category} (${act.subtype}): ${act.quantity} -> ${act.co2eKg} kg CO2e. Notes: ${act.notes || ''}\n`;
    });
    fileContent += `\nGOALS SET:\n`;
    goals.forEach(g => {
      const dateStr = new Date(g.targetDate.toMillis ? g.targetDate.toMillis() : g.targetDate).toLocaleDateString();
      fileContent += `- ${g.category} - ${g.type}: Target ${g.targetValue} (Baseline: ${g.baselineValue}) by ${dateStr}. Status: ${g.status}\n`;
    });
  }

  // 4. Upload File to Firebase Storage
  const bucket = getStorage().bucket();
  const filename = `users/${uid}/exports/export_${Date.now()}.${format === 'csv' ? 'csv' : 'txt'}`;
  const fileRef = bucket.file(filename);

  await fileRef.save(fileContent, { contentType });

  // 5. Generate Signed Download URL (with local emulator URL fallback)
  let downloadUrl = '';
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true' || process.env.FIREBASE_EMULATOR_HUB;
  
  if (isEmulator) {
    downloadUrl = `http://localhost:9199/v0/b/${bucket.name}/o/${encodeURIComponent(fileRef.name)}?alt=media`;
  } else {
    try {
      const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
      });
      downloadUrl = url;
    } catch (err: any) {
      // If service account key is missing in production/sandbox, return a public URL fallback
      downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileRef.name)}?alt=media`;
    }
  }

  return { downloadUrl };
});
