/**
 * @module Google Text-to-Speech Client
 * @description Server-side client for Google Cloud TTS API.
 * Provides audio accessibility support in multiple Indian languages.
 */

import type { TextToSpeechResponse } from '@/types/api';

/** Language-to-voice mappings for Indian languages */
const VOICE_MAPPINGS: Record<string, { languageCode: string; name: string }> = {
  en: { languageCode: 'en-IN', name: 'en-IN-Neural2-A' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
  bn: { languageCode: 'bn-IN', name: 'bn-IN-Neural2-A' },
  te: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
  mr: { languageCode: 'mr-IN', name: 'mr-IN-Standard-A' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Neural2-A' },
  gu: { languageCode: 'gu-IN', name: 'gu-IN-Neural2-A' },
  kn: { languageCode: 'kn-IN', name: 'kn-IN-Neural2-A' },
  ml: { languageCode: 'ml-IN', name: 'ml-IN-Neural2-A' },
  pa: { languageCode: 'pa-IN', name: 'pa-IN-Standard-A' },
  ur: { languageCode: 'ur-IN', name: 'ur-IN-Standard-A' },
};

/**
 * Convert text to speech using Google Cloud TTS API
 * @param text - Text to convert to speech
 * @param languageCode - Language code (e.g., 'en', 'hi')
 * @returns Base64 encoded audio content
 */
export const textToSpeech = async (
  text: string,
  languageCode: string
): Promise<TextToSpeechResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Google Cloud API key is not configured');
  }

  const voiceConfig = VOICE_MAPPINGS[languageCode] || VOICE_MAPPINGS['en'];

  const requestBody = {
    input: { text: text.substring(0, 5000) },
    voice: {
      languageCode: voiceConfig.languageCode,
      name: voiceConfig.name,
      ssmlGender: 'FEMALE' as const,
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: 0.95,
      pitch: 0,
      volumeGainDb: 0,
    },
  };

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `TTS API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();

  return {
    audioContent: data.audioContent,
    format: 'mp3',
  };
};

/**
 * Get the supported voice for a language
 * @param languageCode - Language code
 * @returns Whether TTS is supported for this language
 */
export const isTTSSupported = (languageCode: string): boolean => {
  return languageCode in VOICE_MAPPINGS;
};
