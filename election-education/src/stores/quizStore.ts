/**
 * @module Quiz Store
 * @description Zustand store for managing quiz state.
 */

import { create } from 'zustand';
import type { Quiz, QuizAnswer, QuizState } from '@/types/quiz';

interface QuizStoreState extends QuizState {
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  resetQuiz: () => void;
  getScore: () => number;
  getPercentage: () => number;
}

export const useQuizStore = create<QuizStoreState>((set, get) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [],
  isActive: false,
  isPaused: false,
  startTime: null,
  consecutiveCorrect: 0,

  startQuiz: (quiz) =>
    set({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      answers: [],
      isActive: true,
      isPaused: false,
      startTime: Date.now(),
      consecutiveCorrect: 0,
    }),

  answerQuestion: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
      consecutiveCorrect: answer.isCorrect
        ? state.consecutiveCorrect + 1
        : 0,
    })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  pauseQuiz: () => set({ isPaused: true }),
  resumeQuiz: () => set({ isPaused: false }),

  resetQuiz: () =>
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      answers: [],
      isActive: false,
      isPaused: false,
      startTime: null,
      consecutiveCorrect: 0,
    }),

  getScore: () => {
    const { answers } = get();
    return answers.reduce((sum, a) => (a.isCorrect ? sum + 1 : sum), 0);
  },

  getPercentage: () => {
    const { answers, currentQuiz } = get();
    if (!currentQuiz || answers.length === 0) return 0;
    const correct = answers.filter((a) => a.isCorrect).length;
    return Math.round((correct / currentQuiz.questions.length) * 100);
  },
}));
