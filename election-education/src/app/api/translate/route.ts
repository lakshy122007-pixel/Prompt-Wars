import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/auth';
import { rateLimit } from '@/lib/security/rateLimit';
import { translateText } from '@/lib/google/translate';
import { HTTP_STATUS } from '@/lib/constants/app';
import { logger } from '@/lib/utils/logger';
import { getErrorMessage } from '@/lib/utils/errors';

const SUPPORTED_LANGUAGES = new Set([
  'en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'pa', 'or', 'as',
  'ks', 'sd', 'ur', 'sa', 'kok', 'mni', 'ne', 'bho', 'mai', 'doi', 'sat'
]);

/**
 * Handles POST requests to translate text into supported Indian languages.
 * Requires valid bearer token authentication and rate-limiting enforcement.
 *
 * @param request - NextRequest object
 * @returns NextResponse with translation data or error info
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get('Authorization');
    const user = await verifyAuthToken(authHeader);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // 2. Rate Limiting
    const rateLimitResult = await rateLimit(request, { limit: 100, window: '1h' });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        {
          status: HTTP_STATUS.TOO_MANY_REQUESTS,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter ?? 60),
          },
        }
      );
    }

    // 3. Parse and Validate Request Body
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { text, targetLanguage } = body as Record<string, unknown>;
    if (typeof text !== 'string' || typeof targetLanguage !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing text or targetLanguage' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Validation checks matching the tests:
    // a. Text length limit <= 10000
    if (text.length > 10000) {
      return NextResponse.json(
        { success: false, error: 'Text too long' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // b. Valid supported language code check
    if (!SUPPORTED_LANGUAGES.has(targetLanguage)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported target language' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // 4. Perform translation
    // If target language is 'en', return original text without calling Translate API
    if (targetLanguage === 'en') {
      return NextResponse.json({
        success: true,
        data: {
          translatedText: text,
          sourceLanguage: 'en',
          targetLanguage: 'en',
        },
      });
    }

    // Call translation utility
    const result = await translateText(text, targetLanguage);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    logger.error('Translate API error', { error: getErrorMessage(error) });
    return NextResponse.json(
      { success: false, error: 'Failed to translate text' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
