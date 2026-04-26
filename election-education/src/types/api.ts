/**
 * API response type definitions
 */

/** Standard API success response */
export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
}

/** Standard API error response */
export interface ApiErrorResponse {
  error: string;
  success: false;
  details?: Record<string, string[]>;
  retryAfter?: number;
}

/** Union type for all API responses */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  success: true;
}

/** Translation API response */
export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

/** TTS API response */
export interface TextToSpeechResponse {
  audioContent: string;
  format: 'mp3' | 'ogg' | 'wav';
}

/** Streaming chat response chunk */
export interface ChatStreamChunk {
  type: 'text' | 'done' | 'error';
  content: string;
}

/** App error class */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
