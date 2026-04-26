/**
 * @module Firebase Analytics Helpers
 * @description Analytics event tracking for user behavior monitoring.
 */

import { getAnalytics, logEvent, setUserId, setUserProperties, type Analytics } from 'firebase/analytics';
import { app } from './config';

let analytics: Analytics | null = null;

/**
 * Initialize analytics (client-side only)
 * @returns Analytics instance or null on server
 */
const getAnalyticsInstance = (): Analytics | null => {
  if (typeof window === 'undefined' || !app) return null;
  if (!analytics) {
    try {
      analytics = getAnalytics(app);
    } catch {
      return null;
    }
  }
  return analytics;
};

/**
 * Track a page view event
 * @param pagePath - The current page path
 * @param pageTitle - The page title
 */
export const trackPageView = (pagePath: string, pageTitle: string): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  logEvent(instance, 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track a quiz completion event
 * @param quizId - The quiz ID
 * @param category - Quiz category
 * @param score - User's score
 * @param totalQuestions - Total questions in quiz
 */
export const trackQuizComplete = (
  quizId: string,
  category: string,
  score: number,
  totalQuestions: number
): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  logEvent(instance, 'quiz_complete', {
    quiz_id: quizId,
    category,
    score,
    total_questions: totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
  });
};

/**
 * Track an AI assistant interaction
 * @param action - The action type (message_sent, feedback_given)
 * @param language - The language used
 */
export const trackAssistantInteraction = (
  action: 'message_sent' | 'feedback_given' | 'tts_played',
  language: string
): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  logEvent(instance, 'assistant_interaction', { action, language });
};

/**
 * Track a language change event
 * @param fromLanguage - Previous language code
 * @param toLanguage - New language code
 */
export const trackLanguageChange = (fromLanguage: string, toLanguage: string): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  logEvent(instance, 'language_change', {
    from_language: fromLanguage,
    to_language: toLanguage,
  });
};

/**
 * Track learning module progress
 * @param moduleId - The module ID
 * @param lessonId - The lesson ID
 * @param action - The action (started, completed)
 */
export const trackLearningProgress = (
  moduleId: string,
  lessonId: string,
  action: 'started' | 'completed'
): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  logEvent(instance, 'learning_progress', {
    module_id: moduleId,
    lesson_id: lessonId,
    action,
  });
};

/**
 * Track polling station search
 * @param method - Search method (geolocation, address, pincode)
 */
export const trackPollingSearch = (
  method: 'geolocation' | 'address' | 'pincode'
): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  logEvent(instance, 'polling_station_search', { method });
};

/**
 * Set the authenticated user ID for analytics
 * @param uid - The user's UID
 */
export const setAnalyticsUserId = (uid: string): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  setUserId(instance, uid);
};

/**
 * Set user properties for segmentation
 * @param properties - Key-value pairs of user properties
 */
export const setAnalyticsUserProperties = (
  properties: Record<string, string>
): void => {
  const instance = getAnalyticsInstance();
  if (!instance) return;
  setUserProperties(instance, properties);
};
