/**
 * @module Validators
 * @description Zod validation schemas for all form inputs and API requests.
 */

import { z } from 'zod';

/** Voter eligibility form validation schema */
export const voterEligibilitySchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const d = new Date(date);
      return d instanceof Date && !isNaN(d.getTime());
    }, 'Invalid date'),
  nationality: z.enum(['Indian', 'Other']),
  state: z.string().min(1, 'State is required'),
  constituency: z.string().min(1, 'Constituency is required'),
  hasVoterId: z.boolean(),
  voterIdNumber: z
    .string()
    .regex(/^[A-Z]{3}\d{7}$/, 'Invalid voter ID format (e.g., ABC1234567)')
    .optional(),
});

/** Chat message validation schema */
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters'),
  conversationId: z.string().optional(),
  language: z.string().min(2).max(5).optional(),
});

/** Translation request validation schema */
export const translationSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text must be less than 5000 characters'),
  targetLanguage: z.string().min(2).max(5),
  sourceLanguage: z.string().min(2).max(5).optional(),
});

/** TTS request validation schema */
export const ttsSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text must be less than 5000 characters'),
  language: z.string().min(2).max(5).default('en'),
});

/** Quiz answer submission schema */
export const quizAnswerSchema = z.object({
  quizId: z.string().min(1),
  questionId: z.string().min(1),
  selectedAnswer: z.number().min(0).max(3),
  timeTaken: z.number().min(0),
});

/** Polling station search schema */
export const pollingSearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(1).max(50).default(10),
  accessibleOnly: z.boolean().default(false),
});

/** User profile update schema */
export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  preferredLanguage: z.string().min(2).max(5).optional(),
  accessibilityPreferences: z
    .object({
      fontSize: z.enum(['normal', 'large', 'extra-large']).optional(),
      highContrast: z.boolean().optional(),
      reducedMotion: z.boolean().optional(),
      screenReaderMode: z.boolean().optional(),
      textToSpeech: z.boolean().optional(),
      keyboardOnly: z.boolean().optional(),
      dyslexiaFont: z.boolean().optional(),
    })
    .optional(),
});

/** News search schema */
export const newsSearchSchema = z.object({
  query: z.string().min(1).max(200).default('Indian elections'),
  page: z.number().min(1).max(10).default(1),
});

/**
 * Validate age for voter eligibility (must be 18+)
 * @param dateOfBirth - Date of birth string (YYYY-MM-DD)
 * @returns Whether the person is 18+ years old
 */
export const isEligibleAge = (dateOfBirth: string): boolean => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 18;
};
