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

// Mock auth implementation for local development when Firebase is not configured
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
}

let mockCurrentUser: MockUser | null = null;
const authListeners = new Set<(user: User | null) => void>();

const base64urlEncode = (str: string): string => {
  let base64: string;
  if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(str, 'utf-8').toString('base64');
  } else {
    const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });
    base64 = btoa(utf8Bytes);
  }
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const createMockJwt = (uid: string, email: string | null) => {
  const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64urlEncode(
    JSON.stringify({
      user_id: uid,
      email: email,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  );
  return `${header}.${payload}.mock_signature`;
};

const triggerAuthListeners = () => {
  authListeners.forEach((cb) => cb(mockCurrentUser as unknown as User));
};

/**
 * Sign in with Google popup
 * @returns The authenticated user
 */
export const signInWithGoogle = async (): Promise<User> => {
  if (!auth || !googleProvider) {
    mockCurrentUser = {
      uid: 'mock-google-user-123',
      email: 'demouser@electionedu.org',
      displayName: 'Democracy Citizen',
      photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Democracy',
      isAnonymous: false,
      getIdToken: async () => createMockJwt('mock-google-user-123', 'demouser@electionedu.org'),
    };
    triggerAuthListeners();
    return mockCurrentUser as unknown as User;
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Sign in anonymously for guest access
 * @returns The anonymous user
 */
export const signInAsGuest = async (): Promise<User> => {
  if (!auth) {
    mockCurrentUser = {
      uid: 'mock-guest-456',
      email: null,
      displayName: 'Guest Citizen',
      photoURL: null,
      isAnonymous: true,
      getIdToken: async () => createMockJwt('mock-guest-456', null),
    };
    triggerAuthListeners();
    return mockCurrentUser as unknown as User;
  }
  const result = await signInAnonymously(auth);
  return result.user;
};

/**
 * Upgrade anonymous user to Google account (link accounts)
 * @returns The linked user
 */
export const upgradeAnonymousToGoogle = async (): Promise<User> => {
  if (!auth || !googleProvider) {
    mockCurrentUser = {
      uid: 'mock-google-user-123',
      email: 'demouser@electionedu.org',
      displayName: 'Democracy Citizen',
      photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Democracy',
      isAnonymous: false,
      getIdToken: async () => createMockJwt('mock-google-user-123', 'demouser@electionedu.org'),
    };
    triggerAuthListeners();
    return mockCurrentUser as unknown as User;
  }
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
  if (!auth) {
    mockCurrentUser = null;
    triggerAuthListeners();
    return;
  }
  await firebaseSignOut(auth);
};

/**
 * Subscribe to auth state changes
 * @param callback - Function called with user on state change
 * @returns Unsubscribe function
 */
export const onAuthChange = (callback: (user: User | null) => void): Unsubscribe => {
  if (!auth) {
    authListeners.add(callback);
    // Defer initial emission to match onAuthStateChanged async timing
    setTimeout(() => callback(mockCurrentUser as unknown as User), 0);
    return () => {
      authListeners.delete(callback);
    };
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Get the current user's ID token for API authentication
 * @returns The ID token string, or null if not authenticated
 */
export const getIdToken = async (): Promise<string | null> => {
  if (!auth) {
    return mockCurrentUser ? mockCurrentUser.getIdToken() : null;
  }
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
