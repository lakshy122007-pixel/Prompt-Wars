/**
 * @module Firestore Helpers
 * @description CRUD utilities for Firestore collections with type safety.
 * Gracefully handles missing Firebase configuration.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile } from '@/types/auth';
import type { QuizResult } from '@/types/quiz';

/**
 * Get a user profile by UID
 * @param uid - The user's Firebase UID
 * @returns User profile or null
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as UserProfile;
};

/**
 * Create or update a user profile
 * @param uid - The user's Firebase UID
 * @param data - Partial profile data to merge
 */
export const setUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  if (!db) return;
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, { ...data, lastLoginAt: serverTimestamp() }, { merge: true });
};

/**
 * Update specific fields in a user profile
 * @param uid - The user's Firebase UID
 * @param data - Fields to update
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  if (!db) return;
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, data as DocumentData);
};

/**
 * Save a quiz result to Firestore
 * @param result - The quiz result to save
 * @returns The document reference or null
 */
export const saveQuizResult = async (
  result: QuizResult
): Promise<string | null> => {
  if (!db) return null;
  const colRef = collection(db, 'quizResults');
  const docRef = doc(colRef);
  await setDoc(docRef, { ...result, id: docRef.id });
  return docRef.id;
};

/**
 * Get quiz results for a specific user
 * @param userId - The user's UID
 * @param maxResults - Maximum number of results to fetch
 * @returns Array of quiz results
 */
export const getUserQuizResults = async (
  userId: string,
  maxResults: number = 20
): Promise<QuizResult[]> => {
  if (!db) return [];
  const colRef = collection(db, 'quizResults');
  const q = query(
    colRef,
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as QuizResult);
};

/**
 * Get leaderboard entries (top scores)
 * @param maxEntries - Maximum number of entries
 * @returns Array of quiz results sorted by score
 */
export const getLeaderboard = async (maxEntries: number = 100): Promise<QuizResult[]> => {
  if (!db) return [];
  const colRef = collection(db, 'quizResults');
  const q = query(colRef, orderBy('score', 'desc'), limit(maxEntries));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as QuizResult);
};

/**
 * Save a chat message to Firestore
 * @param userId - The user's UID
 * @param message - The message data
 */
export const saveChatMessage = async (
  userId: string,
  message: { id: string; role: string; content: string; timestamp: string }
): Promise<void> => {
  if (!db) return;
  const docRef = doc(db, 'chatHistory', userId, 'messages', message.id);
  await setDoc(docRef, message);
};

/**
 * Get chat history for a user
 * @param userId - The user's UID
 * @param maxMessages - Maximum messages to fetch
 * @returns Array of chat messages
 */
export const getChatHistory = async (
  userId: string,
  maxMessages: number = 50
): Promise<DocumentData[]> => {
  if (!db) return [];
  const colRef = collection(db, 'chatHistory', userId, 'messages');
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(maxMessages));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
};

/**
 * Save learning progress for a user
 * @param userId - The user's UID
 * @param moduleId - The module ID
 * @param lessonId - The completed lesson ID
 */
export const saveLearningProgress = async (
  userId: string,
  moduleId: string,
  lessonId: string
): Promise<void> => {
  if (!db) return;
  const docRef = doc(db, 'learningProgress', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const modules = data.modules || {};
    const completedLessons = modules[moduleId]?.completedLessons || [];

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    await updateDoc(docRef, {
      [`modules.${moduleId}.completedLessons`]: completedLessons,
      [`modules.${moduleId}.lastAccessedAt`]: serverTimestamp(),
    });
  } else {
    await setDoc(docRef, {
      userId,
      modules: {
        [moduleId]: {
          completedLessons: [lessonId],
          lastAccessedAt: serverTimestamp(),
        },
      },
    });
  }
};

/**
 * Generic query helper for Firestore collections
 * @param collectionPath - The collection path
 * @param constraints - Query constraints
 * @returns Array of documents
 */
export const queryCollection = async <T>(
  collectionPath: string,
  constraints: QueryConstraint[]
): Promise<T[]> => {
  if (!db) return [];
  const colRef = collection(db, collectionPath);
  const q = query(colRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as T);
};
