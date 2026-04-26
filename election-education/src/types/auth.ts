/**
 * Authentication-related type definitions
 */

import type { Timestamp } from 'firebase/firestore';

/** User accessibility preferences stored in profile */
export interface AccessibilityPreferences {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  textToSpeech: boolean;
  keyboardOnly: boolean;
  dyslexiaFont: boolean;
}

/** Quiz progress entry for a user */
export interface QuizProgress {
  quizId: string;
  category: string;
  score: number;
  totalQuestions: number;
  completedAt: Timestamp;
  timeSpent: number;
}

/** Learning progress entry for a user */
export interface LearningProgress {
  moduleId: string;
  lessonsCompleted: string[];
  totalLessons: number;
  lastAccessedAt: Timestamp;
  isComplete: boolean;
}

/** User profile stored in Firestore */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  preferredLanguage: string;
  accessibilityPreferences: AccessibilityPreferences;
  quizProgress: QuizProgress[];
  learnProgress: LearningProgress[];
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  isAnonymous: boolean;
}

/** Auth state used in Zustand store */
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/** Session token response from server */
export interface SessionResponse {
  success: boolean;
  expiresAt: string;
}
