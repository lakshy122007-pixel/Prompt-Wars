/**
 * @module CSRF Protection
 * @description CSRF token generation and validation for state-changing requests.
 */

import { NextRequest, NextResponse } from 'next/server';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = '__csrf';
const TOKEN_LENGTH = 32;

/**
 * Generate a random CSRF token
 * @returns A cryptographically random hex string
 */
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(TOKEN_LENGTH);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < TOKEN_LENGTH; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Set CSRF cookie on a response
 * @param response - The NextResponse to add the cookie to
 * @param token - The CSRF token to set
 * @returns The response with CSRF cookie
 */
export const setCsrfCookie = (response: NextResponse, token: string): NextResponse => {
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600, // 1 hour
  });
  return response;
};

/**
 * Validate CSRF token from request
 * @param request - The incoming request
 * @returns Whether the CSRF token is valid
 */
export const validateCsrfToken = (request: NextRequest): boolean => {
  const headerToken = request.headers.get(CSRF_HEADER);
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;

  if (!headerToken || !cookieToken) {
    return false;
  }

  return headerToken === cookieToken;
};

/**
 * CSRF protection middleware for API routes
 * @param request - The incoming request
 * @returns Error response if CSRF validation fails, null if valid
 */
export const csrfProtection = (request: NextRequest): NextResponse | null => {
  const method = request.method.toUpperCase();
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(method)) {
    return null;
  }

  if (!validateCsrfToken(request)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  return null;
};
