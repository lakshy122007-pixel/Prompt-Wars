/**
 * @module App Routes
 * @description Centralized route definitions for type-safe navigation.
 */

/** Application route paths */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  QUIZ: '/quiz',
  QUIZ_ACTIVE: (id: string): string => `/quiz/${id}`,
  QUIZ_RESULTS: '/quiz/results',
  LEARN: '/learn',
  LEARN_MODULE: (moduleId: string): string => `/learn/${moduleId}`,
  POLLING_STATION: '/polling-station',
  VOTER_CHECK: '/voter-check',
  NEWS: '/news',
  ASSISTANT: '/assistant',
} as const;

/** API route paths */
export const API_ROUTES = {
  AUTH_SESSION: '/api/auth/session',
  ASSISTANT: '/api/assistant',
  TRANSLATE: '/api/translate',
  POLLING_STATIONS: '/api/polling-stations',
  VOTER_CHECK: '/api/voter-check',
  QUIZ: '/api/quiz',
  QUIZ_BY_ID: (id: string): string => `/api/quiz/${id}`,
  NEWS: '/api/news',
  TTS: '/api/tts',
} as const;

/** Navigation items for the sidebar/header */
export const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: ROUTES.LEARN, label: 'Learn', icon: 'BookOpen' },
  { href: ROUTES.QUIZ, label: 'Quiz', icon: 'HelpCircle' },
  { href: ROUTES.ASSISTANT, label: 'AI Assistant', icon: 'Bot' },
  { href: ROUTES.POLLING_STATION, label: 'Polling Stations', icon: 'MapPin' },
  { href: ROUTES.VOTER_CHECK, label: 'Voter Check', icon: 'UserCheck' },
  { href: ROUTES.NEWS, label: 'News', icon: 'Newspaper' },
] as const;

/** Protected routes that require authentication */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.QUIZ_RESULTS,
] as const;

/** Public routes accessible without authentication */
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
] as const;
