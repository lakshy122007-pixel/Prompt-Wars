// tests/unit/lib/errors.test.ts
import { isError, getErrorMessage, toApiErrorBody, ERROR_CODES } from '@/lib/utils/errors';
import { HTTP_STATUS } from '@/lib/constants/app';

describe('Error Utilities', () => {
  describe('isError', () => {
    it('returns true for Error instances', () => {
      expect(isError(new Error('test'))).toBe(true);
      expect(isError(new TypeError('type test'))).toBe(true);
    });

    it('returns false for non-Error values', () => {
      expect(isError('error')).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
      expect(isError({ message: 'test' })).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('extracts message from Error instance', () => {
      expect(getErrorMessage(new Error('This is an error'))).toBe('This is an error');
    });

    it('returns the string itself if error is a string', () => {
      expect(getErrorMessage('Custom error string')).toBe('Custom error string');
    });

    it('returns default fallback message for unexpected error types', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred. Please try again.');
      expect(getErrorMessage(123)).toBe('An unexpected error occurred. Please try again.');
      expect(getErrorMessage({})).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('toApiErrorBody', () => {
    it('maps Error instance to standardized API error body', () => {
      const result = toApiErrorBody(new Error('Something failed'));
      expect(result).toEqual({
        error: 'Something failed',
        code: ERROR_CODES.INTERNAL_ERROR,
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });
    });

    it('maps non-Error to generic API error body', () => {
      const result = toApiErrorBody('Something else failed');
      expect(result).toEqual({
        error: 'Internal server error',
        code: ERROR_CODES.INTERNAL_ERROR,
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
