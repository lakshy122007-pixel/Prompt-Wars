/**
 * @module Supported Languages
 * @description All 22 scheduled languages of India + English with metadata.
 */

import type { SupportedLanguage } from '@/types/election';

/** Complete list of supported languages */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', direction: 'ltr' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', direction: 'rtl' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', direction: 'rtl' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', direction: 'ltr' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', direction: 'ltr' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', direction: 'ltr' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', direction: 'ltr' },
  { code: 'bo', name: 'Bodo', nativeName: 'बड़ो', direction: 'ltr' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', direction: 'ltr' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', direction: 'ltr' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', direction: 'ltr' },
];

/** Default language */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Get a language by code
 * @param code - Language code
 * @returns Language object or default (English)
 */
export const getLanguageByCode = (code: string): SupportedLanguage => {
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ||
    SUPPORTED_LANGUAGES[0]
  );
};

/**
 * Check if a language uses RTL direction
 * @param code - Language code
 * @returns Whether the language is RTL
 */
export const isRTL = (code: string): boolean => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return lang?.direction === 'rtl';
};
