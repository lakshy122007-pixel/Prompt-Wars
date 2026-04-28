/**
 * @module Application Constants
 * @description Centralized constants for the entire application.
 * Eliminates magic numbers and strings. All values are frozen with `as const`.
 */

/** Rate limiting configuration per endpoint */
export const RATE_LIMITS = {
  /** Chat messages per hour for authenticated users */
  CHAT_AUTHENTICATED: 100,
  /** Chat messages per hour for anonymous users */
  CHAT_ANONYMOUS: 20,
  /** Translation requests per hour */
  TRANSLATE: 200,
  /** TTS requests per hour */
  TEXT_TO_SPEECH: 50,
  /** Voter check requests per hour */
  VOTER_CHECK: 30,
} as const;

/** Input validation constraints */
export const VALIDATION = {
  /** Maximum chat message length in characters */
  MAX_MESSAGE_LENGTH: 2_000,
  /** Minimum message length */
  MIN_MESSAGE_LENGTH: 1,
  /** Maximum translation text length */
  MAX_TRANSLATE_LENGTH: 10_000,
  /** Maximum TTS text length */
  MAX_TTS_LENGTH: 5_000,
  /** Indian pincode length */
  PINCODE_LENGTH: 6,
  /** Minimum voting age in India (Article 326) */
  MIN_VOTING_AGE: 18,
  /** Maximum quiz answer options */
  MAX_QUIZ_OPTIONS: 4,
  /** Maximum name length */
  MAX_NAME_LENGTH: 100,
  /** Minimum name length */
  MIN_NAME_LENGTH: 2,
} as const;

/** Quiz scoring and timing configuration */
export const QUIZ_CONFIG = {
  /** Time limit for easy questions in seconds */
  TIME_LIMIT_EASY: 30,
  /** Time limit for medium questions in seconds */
  TIME_LIMIT_MEDIUM: 45,
  /** Time limit for hard questions in seconds */
  TIME_LIMIT_HARD: 60,
  /** Points for easy questions */
  POINTS_EASY: 10,
  /** Points for medium questions */
  POINTS_MEDIUM: 20,
  /** Points for hard questions */
  POINTS_HARD: 30,
  /** Score percentage required for certificate */
  CERTIFICATE_THRESHOLD: 80,
  /** Consecutive correct answers before difficulty increases */
  ADAPTIVE_THRESHOLD: 3,
  /** Maximum questions per quiz session */
  MAX_QUESTIONS_PER_SESSION: 20,
} as const;

/** Google Maps configuration */
export const MAPS_CONFIG = {
  /** Default search radius in meters */
  DEFAULT_RADIUS_METERS: 5_000,
  /** Maximum search radius in meters */
  MAX_RADIUS_METERS: 20_000,
  /** Maximum polling stations to display */
  MAX_STATIONS_DISPLAYED: 10,
  /** Default map zoom level */
  DEFAULT_ZOOM: 14,
  /** Zoom when station is selected */
  SELECTED_STATION_ZOOM: 16,
  /** Geographic center of India */
  INDIA_CENTER: { lat: 20.5937, lng: 78.9629 } as const,
} as const;

/** Firestore collection names */
export const COLLECTIONS = {
  USERS: 'users',
  QUIZ_RESULTS: 'quizResults',
  CHAT_HISTORY: 'chatHistory',
  LEARNING_PROGRESS: 'learningProgress',
  LEADERBOARD: 'leaderboard',
  FEEDBACK: 'feedback',
} as const;

/** HTTP status codes used in API responses */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** TTS audio configuration */
export const AUDIO_CONFIG = {
  FORMAT: 'MP3' as const,
  SPEAKING_RATE: 0.95,
  PITCH: 0,
  VOLUME_GAIN: 0,
  DEFAULT_VOICE: 'en-IN-Neural2-A',
} as const;

/** localStorage key names */
export const STORAGE_KEYS = {
  THEME: 'theme',
  PREFERRED_LANGUAGE: 'preferred-language',
  LAST_QUIZ_ID: 'last-quiz-id',
} as const;

/** Animation durations in milliseconds */
export const ANIMATION = {
  /** Counter animation duration */
  COUNTER_DURATION_MS: 1_500,
  /** Fade animation frame interval */
  FRAME_INTERVAL_MS: 16,
} as const;
