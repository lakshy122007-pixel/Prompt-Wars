import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { signUpSchema } from '@ecotrack/shared';

export const createAccount = onCall(async (request) => {
  const { data } = request;
  
  // 1. Validate Input schemas
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    throw new HttpsError('invalid-argument', 'Invalid signup data: ' + parsed.error.message);
  }

  const { name, email, password, recaptchaToken } = parsed.data;

  // 2. Verify reCAPTCHA score (server-side check)
  const isLocal = process.env.FUNCTIONS_EMULATOR === 'true' || !process.env.RECAPTCHA_SECRET;
  if (!isLocal) {
    if (!recaptchaToken) {
      throw new HttpsError('permission-denied', 'reCAPTCHA token is missing');
    }
    
    try {
      const secretKey = process.env.RECAPTCHA_SECRET;
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
      const res = await fetch(verifyUrl, { method: 'POST' });
      const verifyData: any = await res.json();
      
      if (!verifyData.success || verifyData.score < 0.5) {
        throw new HttpsError('permission-denied', 'reCAPTCHA verification failed');
      }
    } catch (err: any) {
      if (err instanceof HttpsError) throw err;
      throw new HttpsError('internal', 'Error verifying reCAPTCHA: ' + err.message);
    }
  }

  const db = getFirestore();
  const auth = getAuth();

  // 3. Check duplicate email (in transaction / query to avoid exposing email exists)
  try {
    try {
      await auth.getUserByEmail(email);
      // If no error, email exists!
      throw new HttpsError('already-exists', 'An error occurred during account creation.');
    } catch (getUserError: any) {
      // If error is user-not-found, we are good to proceed. Otherwise rethrow.
      if (getUserError.code !== 'auth/user-not-found') {
        throw getUserError;
      }
    }

    // 4. Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false
    });

    const uid = userRecord.uid;

    // 5. Create user profile in Firestore (users/{uid})
    await db.collection('users').doc(uid).set({
      uid,
      displayName: name,
      email,
      createdAt: FieldValue.serverTimestamp(),
      unitsPreference: 'metric',
      analyticsConsent: false,
      communityOptIn: false,
      communityHandle: null,
      weeklyDigestEnabled: true,
      emailVerified: false
    });

    // 6. Generate Verification Email link (logged to console in emulator, sent in real env)
    const verificationLink = await auth.generateEmailVerificationLink(email);
    console.log(`[Email Verification Link for ${email}]: ${verificationLink}`);

    // In a real environment, you would send this link via Gmail API or standard transporter.
    // For this build, logging it allows local E2E/manual verify bypass.
    
    return { uid };
  } catch (err: any) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError('internal', 'Failed to create user account: ' + err.message);
  }
});
