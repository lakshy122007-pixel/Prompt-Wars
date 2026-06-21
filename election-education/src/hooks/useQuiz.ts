import { useState, useCallback } from 'react';
import type { QuizQuestion } from '@/types/quiz';

interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

/**
 * Custom hook to manage the state of a quiz session.
 */
export function useQuiz(questions: QuizQuestion[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const submitAnswer = useCallback((selectedAnswer: number) => {
    if (!currentQuestion || isComplete) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const points = currentQuestion.points || 0;

    if (isCorrect) {
      setScore(prev => prev + points);
    }

    setAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        timeTaken: 10,
      }
    ]);
  }, [currentQuestion, isComplete]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setIsComplete(false);
  }, []);

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  return {
    currentQuestionIndex,
    currentQuestion,
    score,
    answers,
    isComplete,
    percentage,
    submitAnswer,
    nextQuestion,
    restartQuiz,
  };
}
