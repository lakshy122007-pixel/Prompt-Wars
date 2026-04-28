// tests/unit/hooks/useQuiz.test.ts
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '@/hooks/useQuiz';
import type { QuizQuestion } from '@/types/quiz';

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q001',
    category: 'voter-eligibility',
    difficulty: 'easy',
    question: 'Question 1?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'Explanation 1',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q002',
    category: 'voting-process',
    difficulty: 'medium',
    question: 'Question 2?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 2,
    explanation: 'Explanation 2',
    points: 20,
    timeLimit: 45,
  },
];

describe('useQuiz', () => {
  it('initializes with first question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
  });

  it('tracks score correctly on correct answer', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => result.current.submitAnswer(0));
    expect(result.current.score).toBe(10);
  });

  it('does not add score on wrong answer', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => result.current.submitAnswer(1));
    expect(result.current.score).toBe(0);
  });

  it('advances to next question after answer', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.submitAnswer(0); result.current.nextQuestion(); });
    expect(result.current.currentQuestionIndex).toBe(1);
  });

  it('marks quiz as complete after last question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.submitAnswer(0); result.current.nextQuestion(); });
    act(() => { result.current.submitAnswer(2); result.current.nextQuestion(); });
    expect(result.current.isComplete).toBe(true);
  });

  it('calculates percentage correctly', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.submitAnswer(0); result.current.nextQuestion(); });
    act(() => { result.current.submitAnswer(2); result.current.nextQuestion(); });
    expect(result.current.percentage).toBe(100);
  });

  it('resets quiz state on restart', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => { result.current.submitAnswer(0); result.current.nextQuestion(); });
    act(() => result.current.restartQuiz());
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });

  it('records answer history', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));
    act(() => result.current.submitAnswer(1));
    expect(result.current.answers[0]).toEqual({
      questionId: 'q001',
      selectedAnswer: 1,
      isCorrect: false,
      timeTaken: expect.any(Number),
    });
  });
});
