/**
 * @module Google Translate Client
 * @description Server-side client for Google Cloud Translation API.
 * Handles translation between 22 Indian languages + English.
 */

import type { TranslationResponse } from '@/types/api';

/**
 * Translate text using Google Cloud Translation API
 * @param text - Text to translate
 * @param targetLanguage - Target language code
 * @param sourceLanguage - Source language code (auto-detect if empty)
 * @returns Translation response with translated text
 */
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Translation API key is not configured');
  }

  const url = `https://translation.googleapis.com/language/translate/v2`;
  const params = new URLSearchParams({
    q: text,
    target: targetLanguage,
    key: apiKey,
    format: 'text',
  });

  if (sourceLanguage) {
    params.set('source', sourceLanguage);
  }

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Translation API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  const translation = data.data?.translations?.[0];

  if (!translation) {
    throw new Error('No translation returned from API');
  }

  return {
    translatedText: translation.translatedText,
    sourceLanguage: translation.detectedSourceLanguage || sourceLanguage || 'unknown',
    targetLanguage,
  };
};

/**
 * Detect the language of input text
 * @param text - Text to detect language for
 * @returns Detected language code
 */
export const detectLanguage = async (text: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Translation API key is not configured');
  }

  const url = `https://translation.googleapis.com/language/translate/v2/detect`;
  const params = new URLSearchParams({
    q: text,
    key: apiKey,
  });

  const response = await fetch(`${url}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Language detection failed: ${response.status}`);
  }

  const data = await response.json();
  const detection = data.data?.detections?.[0]?.[0];

  return detection?.language || 'en';
};

/**
 * Batch translate multiple texts
 * @param texts - Array of texts to translate
 * @param targetLanguage - Target language code
 * @returns Array of translated texts
 */
export const batchTranslate = async (
  texts: string[],
  targetLanguage: string
): Promise<string[]> => {
  const results = await Promise.all(
    texts.map((text) => translateText(text, targetLanguage))
  );
  return results.map((r) => r.translatedText);
};
