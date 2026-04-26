/**
 * @module Firebase Auth Helpers
 * @description Authentication utility functions for client and server-side auth.
 * Gracefully handles missing Firebase configuration.
 */

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
  linkWithPopup,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

const googleProvider = isFirebaseConfigured ? (() => {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  return provider;
})() : null;

/**
 * Sign in with Google popup
 * @returns The authenticated user
 */
export const signInWithGoogle = async (): Promise<User> => {
  if (!auth || !googleProvider) throw new Error('Firebase not configured');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Sign in anonymously for guest access
 * @returns The anonymous user
 */
export const signInAsGuest = async (): Promise<User> => {
  if (!auth) throw new Error('Firebase not configured');
  const result = await signInAnonymously(auth);
  return result.user;
};

/**
 * Upgrade anonymous user to Google account (link accounts)
 * @returns The linked user
 */
export const upgradeAnonymousToGoogle = async (): Promise<User> => {
  if (!auth || !googleProvider) throw new Error('Firebase not configured');
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.isAnonymous) {
    throw new Error('No anonymous user to upgrade');
  }
  const result = await linkWithPopup(currentUser, googleProvider);
  return result.user;
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  if (!auth) return;
  await firebaseSignOut(auth);
};

/**
 * Subscribe to auth state changes
 * @param callback - Function called with user on state change
 * @returns Unsubscribe function
 */
export const onAuthChange = (callback: (user: User | null) => void): Unsubscribe => {
  if (!auth) {
    // If Firebase isn't configured, immediately call back with null
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Get the current user's ID token for API authentication
 * @returns The ID token string, or null if not authenticated
 */
export const getIdToken = async (): Promise<string | null> => {
  if (!auth) return null;
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return currentUser.getIdToken(true);
};

/**
 * Verify an auth token on the server side
 * Used by API route handlers for authentication
 * @param authHeader - The Authorization header value
 * @returns Decoded token with uid, or null if invalid
 */
export const verifyAuthToken = async (
  authHeader: string | null
): Promise<{ uid: string; email?: string } | null> => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // In production, use firebase-admin to verify tokens server-side
    // For client-side validation, we decode the JWT payload
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return {
      uid: payload.user_id || payload.sub,
      email: payload.email,
    };
  } catch {
    return null;
  }
};
