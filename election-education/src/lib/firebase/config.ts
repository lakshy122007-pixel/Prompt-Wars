/**
 * @module Firebase Configuration
 * @description Initializes Firebase client SDK with environment variables.
 * Ensures single initialization using getApps() check.
 * Gracefully handles missing configuration (returns null instances).
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { logger } from '@/lib/utils/logger';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** Whether Firebase is configured with valid credentials */
export const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.length > 0 &&
  typeof firebaseConfig.projectId === 'string' &&
  firebaseConfig.projectId.length > 0;

/**
 * Returns the singleton Firebase app instance
 * @returns Initialized Firebase app or null if not configured
 */
export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured) return null;
  try {
    if (getApps().length === 0) {
      return initializeApp(firebaseConfig);
    }
    return getApp();
  } catch (e) {
    logger.warn('Firebase initialization failed', { error: String(e) });
    return null;
  }
};

/** Firebase app instance (null if not configured) */
export const app: FirebaseApp | null = getFirebaseApp();

/** Firebase Auth instance (null if not configured) */
export const auth: Auth | null = app ? getAuth(app) : null;

/** Firestore database instance (null if not configured) */
export const db: Firestore | null = app ? getFirestore(app) : null;

/** Firebase Storage instance (null if not configured) */
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;
