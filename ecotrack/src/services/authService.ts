import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  User
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from './firebaseConfig.js';

const createAccountCallable = httpsCallable(functions, 'createAccount');

export const authService = {
  // 1. Sign Up - calls secure Cloud Function
  signUp: async (signUpData: any) => {
    // Call the Cloud Function
    await createAccountCallable(signUpData);
    // Log user in client-side with the email and password immediately after server-side creation
    const userCredential = await signInWithEmailAndPassword(auth, signUpData.email, signUpData.password);
    return userCredential.user;
  },

  // 2. Email Password Sign In
  signInWithEmail: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // 3. Google Sign In
  signInWithGoogle: async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  },

  // 4. Send Password Reset
  forgotPassword: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  },

  // 5. Sign Out
  logout: async (): Promise<void> => {
    await signOut(auth);
  }
};
