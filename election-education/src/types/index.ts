/**
 * @module Type Exports
 * @description Barrel export for all application type definitions.
 */

export type { UserProfile, AccessibilityPreferences, QuizProgress, LearningProgress, AuthState, SessionResponse } from './auth';
export type { Quiz, QuizQuestion, QuizAnswer, QuizResult, QuizState, QuizCategory, QuizDifficulty } from './quiz';
export type { PollingStation } from './maps';
export type { ApiSuccessResponse, ApiErrorResponse, ApiResponse, TranslationResponse, TextToSpeechResponse, ChatStreamChunk, PaginationMeta, PaginatedResponse } from './api';
export type { ChatMessage, LoadingState, Result, ValidationResult, EligibilityResult, DeepPartial, DeepReadonly } from './common';
export { AppError } from './api';
