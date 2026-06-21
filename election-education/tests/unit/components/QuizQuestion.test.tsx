// tests/unit/components/QuizQuestion.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import type { QuizQuestion as QuizQuestionType } from '@/types/quiz';

const mockQuestion: QuizQuestionType = {
  id: 'q001',
  category: 'voter-eligibility',
  difficulty: 'easy',
  question: 'What is the minimum age to vote in India?',
  options: ['16 years', '18 years', '21 years', '25 years'],
  correctAnswer: 1,
  explanation: 'Article 326 of the Constitution of India sets the minimum voting age at 18.',
  articleReference: 'Article 326, Constitution of India',
  points: 10,
  timeLimit: 30,
};

describe('QuizQuestion', () => {
  it('renders question text', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} />);
    expect(screen.getByText(mockQuestion.question)).toBeInTheDocument();
  });

  it('renders all 4 options', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} />);
    mockQuestion.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('calls onAnswer with correct index when option clicked', async () => {
    const user = userEvent.setup();
    const onAnswer = jest.fn();
    render(<QuizQuestion question={mockQuestion} onAnswer={onAnswer} timeRemaining={30} />);
    
    await user.click(screen.getByText('18 years'));
    expect(onAnswer).toHaveBeenCalledWith(1);
  });

  it('shows correct/wrong feedback after answer', async () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} selectedAnswer={1} />);
    
    expect(screen.getByText(/Article 326 of the/)).toBeInTheDocument();
  });

  it('highlights correct answer in green', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} selectedAnswer={1} />);
    const correctOption = screen.getByText('18 years').closest('button');
    expect(correctOption).toHaveClass('correct');
  });

  it('highlights wrong selection in red', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} selectedAnswer={0} />);
    const wrongOption = screen.getByText('16 years').closest('button');
    expect(wrongOption).toHaveClass('incorrect');
  });

  it('disables all options after answer is selected', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} selectedAnswer={2} />);
    const buttons = screen.getAllByRole('radio');
    buttons.forEach(btn => expect(btn).toBeDisabled());
  });

  it('shows countdown timer', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={15} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('has correct ARIA attributes for accessibility', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} />);
    const optionButtons = screen.getAllByRole('radio');
    expect(optionButtons).toHaveLength(4);
  });

  it('shows article reference when available', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} timeRemaining={30} selectedAnswer={1} />);
    expect(screen.getByText('Article 326, Constitution of India')).toBeInTheDocument();
  });
});
