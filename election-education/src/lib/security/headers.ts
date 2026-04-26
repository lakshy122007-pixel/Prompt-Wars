/**
 * @module Security Headers
 * @description Centralized security headers configuration compliant with OWASP guidelines.
 */

/** Complete security headers object */
export const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' https://maps.googleapis.com https://www.gstatic.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.googleapis.com https://*.firebase.com https://*.firebaseio.com wss://*.firebaseio.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; '),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'X-DNS-Prefetch-Control': 'on',
};

/**
 * Apply security headers to a Headers object
 * @param headers - Headers object to modify
 * @returns Modified headers with security headers applied
 */
export const applySecurityHeaders = (headers: Headers): Headers => {
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }
  return headers;
};

/**
 * Create a new Headers object with security headers
 * @param additionalHeaders - Extra headers to include
 * @returns Headers object with security + additional headers
 */
export const createSecureHeaders = (
  additionalHeaders?: Record<string, string>
): Record<string, string> => {
  return {
    ...securityHeaders,
    ...additionalHeaders,
  };
};
