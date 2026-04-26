/**
 * Election data type definitions
 */

/** Learning module difficulty */
export type ModuleDifficulty = 'beginner' | 'intermediate' | 'advanced';

/** A single lesson within a module */
export interface Lesson {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  keyPoints: string[];
  estimatedMinutes: number;
}

/** A learning module */
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: ModuleDifficulty;
  lessons: Lesson[];
  completionCertificate: boolean;
  icon: string;
  color: string;
}

/** Voter eligibility form data */
export interface VoterEligibilityData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  state: string;
  constituency: string;
  hasVoterId: boolean;
  voterIdNumber?: string;
}

/** Voter eligibility result */
export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  nextSteps: string[];
  registrationUrl?: string;
  nearestOffice?: string;
}

/** Election news article */
export interface ElectionNewsArticle {
  title: string;
  snippet: string;
  url: string;
  source: string;
  publishedDate: string;
  thumbnailUrl?: string;
}

/** Chat message for AI assistant */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: string;
  feedback?: 'positive' | 'negative' | null;
}

/** Chat conversation */
export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/** Supported Indian language */
export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}
