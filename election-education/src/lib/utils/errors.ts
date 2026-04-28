/**
 * @module Error Utilities
 * @description Centralized error handling with typed error codes and type guards.
 */

import { HTTP_STATUS } from '@/lib/constants/app';

/** Application error codes */
export const ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  GEMINI_API_ERROR: 'GEMINI_API_ERROR',
  MAPS_API_ERROR: 'MAPS_API_ERROR',
  TRANSLATE_API_ERROR: 'TRANSLATE_API_ERROR',
  TTS_API_ERROR: 'TTS_API_ERROR',
  FIRESTORE_ERROR: 'FIRESTORE_ERROR',
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

/** Union type of all error codes */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Type guard to check if an unknown value is an Error instance
 * @param error - Unknown value to check
 * @returns Whether the value is an Error
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Extracts a user-friendly message from any error type
 * @param error - Unknown error value
 * @returns Human-readable error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Converts an unknown error to a standardized API error response body
 * @param error - Unknown error
 * @returns Structured error object for JSON responses
 */
export const toApiErrorBody = (
  error: unknown,
): { error: string; code: string; statusCode: number } => {
  if (error instanceof Error) {
    return {
      error: error.message,
      code: ERROR_CODES.INTERNAL_ERROR,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
  return {
    error: 'Internal server error',
    code: ERROR_CODES.INTERNAL_ERROR,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  };
};
