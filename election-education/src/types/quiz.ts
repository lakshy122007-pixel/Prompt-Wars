/**
 * Quiz-related type definitions
 */

/** Quiz difficulty levels */
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

/** Quiz categories */
export type QuizCategory =
  | 'voter-eligibility'
  | 'voting-process'
  | 'election-commission'
  | 'constitutional-provisions'
  | 'election-awareness';

/** A single quiz question */
export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  articleReference?: string;
  points: number;
  timeLimit: number;
}

/** Quiz metadata */
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  totalPoints: number;
  estimatedMinutes: number;
  icon: string;
}

/** User's answer to a single question */
export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

/** Complete quiz result */
export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  category: QuizCategory;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  timeTaken: number;
  completedAt: string;
  displayName: string | null;
  photoURL: string | null;
}

/** Quiz state for Zustand store */
export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isActive: boolean;
  isPaused: boolean;
  startTime: number | null;
  consecutiveCorrect: number;
}

/** Leaderboard entry */
export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string | null;
  totalScore: number;
  quizzesCompleted: number;
  averagePercentage: number;
}
