import React from 'react';
import type { QuizQuestion as QuizQuestionType } from '@/types/quiz';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (index: number) => void;
  timeRemaining: number;
  selectedAnswer?: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  timeRemaining,
  selectedAnswer,
}) => {
  const hasAnswered = selectedAnswer !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {question.category.replace('-', ' ')}
        </span>
        <div className="flex items-center space-x-2 text-primary font-bold">
          <span className="text-xl">{timeRemaining}</span>
          <span className="text-xs text-muted-foreground">s left</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground">{question.question}</h2>

      <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="Quiz Options">
        {question.options.map((option, idx) => {
          let btnClass = 'border-border text-foreground hover:bg-muted';
          
          if (hasAnswered) {
            if (idx === question.correctAnswer) {
              btnClass = 'correct bg-primary/10 border-primary text-primary';
            } else if (idx === selectedAnswer) {
              btnClass = 'incorrect bg-destructive/10 border-destructive text-destructive';
            } else {
              btnClass = 'border-border text-muted-foreground opacity-60';
            }
          }

          return (
            <button
              key={idx}
              role="radio"
              aria-checked={selectedAnswer === idx}
              disabled={hasAnswered}
              onClick={() => onAnswer(idx)}
              className={`w-full text-left p-4 border rounded-xl font-medium transition-all focus-ring disabled:cursor-not-allowed ${btnClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className="bg-card border border-border p-5 rounded-2xl space-y-3 animate-fade-in-up">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Explanation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
          </div>
          {question.articleReference && (
            <div className="text-xs text-primary font-semibold">
              {question.articleReference}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
