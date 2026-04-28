/**
 * @module Common Types
 * @description Shared utility types used across the application.
 */

/** Loading state for async operations */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Result type for operations that can fail */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/** Chat message used in AI assistant */
export interface ChatMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

/** Deep partial utility — makes all nested properties optional */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Deep readonly utility — makes all nested properties readonly */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** Validation result returned by form validators */
export interface ValidationResult {
  readonly success: boolean;
  readonly message?: string;
}

/** Voter eligibility check result */
export interface EligibilityResult {
  readonly isEligible: boolean;
  readonly reason: string;
}
