/**
 * @module Quiz Page
 * @description Quiz category selection page with difficulty filters.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  HelpCircle,
  Award,
  Clock,
  Zap,
  Brain,
  CheckCircle,
  Star,
  ArrowRight,
  Trophy,
  Filter,
} from 'lucide-react';
import type { QuizCategory, QuizDifficulty, Quiz } from '@/types/quiz';

const quizCategories: {
  id: QuizCategory;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  questionCount: number;
  color: string;
  iconColor: string;
}[] = [
  {
    id: 'voter-eligibility',
    title: 'Voter Eligibility',
    description: 'Test your knowledge about voter registration rules and eligibility criteria.',
    icon: CheckCircle,
    questionCount: 10,
    color: 'from-saffron/20 to-saffron/5',
    iconColor: 'text-saffron',
  },
  {
    id: 'voting-process',
    title: 'Voting Process',
    description: 'How well do you know the polling day process and EVM usage?',
    icon: Zap,
    questionCount: 10,
    color: 'from-india-green/20 to-india-green/5',
    iconColor: 'text-india-green',
  },
  {
    id: 'election-commission',
    title: 'Election Commission',
    description: 'Questions about ECI structure, powers, and responsibilities.',
    icon: Award,
    questionCount: 10,
    color: 'from-navy-300/20 to-navy-300/5',
    iconColor: 'text-navy dark:text-blue-400',
  },
  {
    id: 'constitutional-provisions',
    title: 'Constitutional Provisions',
    description: 'Deep dive into constitutional articles and electoral laws.',
    icon: Brain,
    questionCount: 10,
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-500',
  },
  {
    id: 'election-awareness',
    title: 'Election Awareness',
    description: 'General awareness about democracy, NOTA, and citizen duties.',
    icon: Star,
    questionCount: 10,
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-500',
  },
];

const difficulties: { value: QuizDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
];

// Sample quiz data for demo — questions for all 5 categories
const sampleQuestions = [
  // ── Voter Eligibility ──
  {
    id: 've1',
    category: 'voter-eligibility' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'What is the minimum age to vote in Indian elections?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correctAnswer: 1,
    explanation: 'As per the 61st Amendment Act of 1988, the minimum voting age in India was reduced from 21 to 18 years.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 've2',
    category: 'voter-eligibility' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'Which form is used for new voter registration in India?',
    options: ['Form 2', 'Form 6', 'Form 8', 'Form 10'],
    correctAnswer: 1,
    explanation: 'Form 6 is used to apply for inclusion of name in the electoral roll for the first time.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 've3',
    category: 'voter-eligibility' as QuizCategory,
    difficulty: 'medium' as QuizDifficulty,
    question: 'What is the qualifying date for determining voter age?',
    options: ['Date of application', 'January 1st of the revision year', 'March 31st', 'Election day'],
    correctAnswer: 1,
    explanation: 'The qualifying date is January 1st of the year in which the electoral roll is being revised.',
    points: 15,
    timeLimit: 30,
  },
  // ── Voting Process ──
  {
    id: 'vp1',
    category: 'voting-process' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'What is applied on a voter\'s finger after voting?',
    options: ['Red ink', 'Indelible ink', 'Stamp', 'Nothing'],
    correctAnswer: 1,
    explanation: 'Indelible ink is applied on the left index finger to prevent double voting. It typically lasts 2-4 weeks.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'vp2',
    category: 'voting-process' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'What does EVM stand for?',
    options: ['Electronic Verification Machine', 'Electronic Voting Machine', 'Electoral Vote Mechanism', 'Election Validation Module'],
    correctAnswer: 1,
    explanation: 'EVM stands for Electronic Voting Machine, used in Indian elections since 2004 for full nationwide deployment.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'vp3',
    category: 'voting-process' as QuizCategory,
    difficulty: 'medium' as QuizDifficulty,
    question: 'How long is the VVPAT slip displayed for voter verification?',
    options: ['3 seconds', '5 seconds', '7 seconds', '10 seconds'],
    correctAnswer: 2,
    explanation: 'The VVPAT slip is displayed for 7 seconds so voters can verify their choice before it drops into the sealed box.',
    points: 15,
    timeLimit: 30,
  },
  // ── Election Commission ──
  {
    id: 'ec1',
    category: 'election-commission' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'Which article of the Indian Constitution provides for the Election Commission?',
    options: ['Article 280', 'Article 324', 'Article 352', 'Article 370'],
    correctAnswer: 1,
    explanation: 'Article 324 of the Constitution vests the superintendence, direction and control of elections in the Election Commission.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'ec2',
    category: 'election-commission' as QuizCategory,
    difficulty: 'medium' as QuizDifficulty,
    question: 'How many members does the Election Commission of India currently have?',
    options: ['1', '2', '3', '5'],
    correctAnswer: 2,
    explanation: 'The ECI is a multi-member body consisting of the Chief Election Commissioner and two Election Commissioners.',
    points: 15,
    timeLimit: 30,
  },
  {
    id: 'ec3',
    category: 'election-commission' as QuizCategory,
    difficulty: 'hard' as QuizDifficulty,
    question: 'Who was the first Chief Election Commissioner of India?',
    options: ['T.N. Seshan', 'Sukumar Sen', 'K.V.K. Sundaram', 'S.P. Sen Verma'],
    correctAnswer: 1,
    explanation: 'Sukumar Sen served as the first CEC of India from 1950 to 1958, overseeing the first two general elections.',
    points: 20,
    timeLimit: 30,
  },
  // ── Constitutional Provisions ──
  {
    id: 'cp1',
    category: 'constitutional-provisions' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'Which act governs the conduct of elections in India?',
    options: ['Indian Penal Code', 'Representation of the People Act', 'Right to Information Act', 'Citizenship Act'],
    correctAnswer: 1,
    explanation: 'The Representation of the People Act (1950 & 1951) provides the legal framework for conducting elections in India.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'cp2',
    category: 'constitutional-provisions' as QuizCategory,
    difficulty: 'medium' as QuizDifficulty,
    question: 'Which amendment reduced the voting age from 21 to 18?',
    options: ['42nd Amendment', '52nd Amendment', '61st Amendment', '73rd Amendment'],
    correctAnswer: 2,
    explanation: 'The 61st Amendment Act of 1988 reduced the voting age from 21 to 18 years by amending Article 326.',
    points: 15,
    timeLimit: 30,
  },
  {
    id: 'cp3',
    category: 'constitutional-provisions' as QuizCategory,
    difficulty: 'hard' as QuizDifficulty,
    question: 'Articles 324-329 of the Constitution deal with which subject?',
    options: ['Fundamental Rights', 'Elections', 'Emergency Provisions', 'Directive Principles'],
    correctAnswer: 1,
    explanation: 'Part XV (Articles 324-329) of the Indian Constitution deals specifically with Elections.',
    points: 20,
    timeLimit: 30,
  },
  // ── Election Awareness ──
  {
    id: 'ea1',
    category: 'election-awareness' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'What does NOTA stand for on the EVM?',
    options: ['Not On The Agenda', 'None Of The Above', 'National Option To Abstain', 'No Other Trusted Alternative'],
    correctAnswer: 1,
    explanation: 'NOTA stands for "None Of The Above" — introduced by the Supreme Court in 2013 to allow voters to reject all candidates.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'ea2',
    category: 'election-awareness' as QuizCategory,
    difficulty: 'easy' as QuizDifficulty,
    question: 'Is it mandatory to carry your Voter ID to vote?',
    options: ['Yes, always', 'No, 12 other IDs are accepted', 'Only for first-time voters', 'Only in rural areas'],
    correctAnswer: 1,
    explanation: 'While the EPIC (Voter ID) is common, the Election Commission accepts 12 alternative photo identity documents for voting.',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'ea3',
    category: 'election-awareness' as QuizCategory,
    difficulty: 'medium' as QuizDifficulty,
    question: 'What is the Model Code of Conduct?',
    options: [
      'A law passed by Parliament',
      'Guidelines for parties/candidates during elections',
      'The Indian Constitution preamble',
      'A code for polling officers',
    ],
    correctAnswer: 1,
    explanation: 'The Model Code of Conduct is a set of guidelines issued by ECI for political parties and candidates to ensure free and fair elections.',
    points: 15,
    timeLimit: 30,
  },
];

export default function QuizPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty | 'all'>('all');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(30);

  const startQuiz = (categoryId: QuizCategory) => {
    // Filter questions by category and optionally by difficulty
    const filtered = sampleQuestions.filter(
      (q) => q.category === categoryId && (selectedDifficulty === 'all' || q.difficulty === selectedDifficulty)
    );

    if (filtered.length === 0) {
      // Fallback: if no questions match the filter, use all questions for this category
      const categoryQuestions = sampleQuestions.filter((q) => q.category === categoryId);
      if (categoryQuestions.length === 0) return; // safety: no questions at all
      filtered.push(...categoryQuestions);
    }

    const quiz: Quiz = {
      id: categoryId,
      title: quizCategories.find((c) => c.id === categoryId)?.title || '',
      description: '',
      category: categoryId,
      difficulty: selectedDifficulty === 'all' ? 'easy' : selectedDifficulty,
      questions: filtered,
      totalPoints: filtered.reduce((sum, q) => sum + q.points, 0),
      estimatedMinutes: Math.max(1, Math.ceil(filtered.length * 0.5)),
      icon: '❓',
    };
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (activeQuiz && idx === activeQuiz.questions[currentQ].correctAnswer) {
      setScore((s) => s + 1);
    }
  }, [answered, activeQuiz, currentQ]);

  useEffect(() => {
    if (!activeQuiz || showResult || answered) return;

    const limit = activeQuiz.questions[currentQ]?.timeLimit || 30;
    setTimeRemaining(limit);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuiz, currentQ, answered, handleAnswer, showResult]);

  const nextQuestion = () => {
    if (currentQ + 1 < activeQuiz!.questions.length) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  // Quiz active view
  if (activeQuiz && !showResult) {
    const q = activeQuiz.questions[currentQ];
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span data-testid="question-count">Question {currentQ + 1} of {activeQuiz.questions.length}</span>
              <span data-testid="countdown-timer" className="font-bold text-primary">{timeRemaining}</span>
              <span>Score: {score}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron to-india-green transition-all duration-500 rounded-full"
                style={{ width: `${((currentQ + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-6" data-testid="quiz-question">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    data-testid={`quiz-option-${idx}`}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                      ${!answered ? 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer' : ''}
                      ${answered && idx === q.correctAnswer ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}
                      ${answered && idx === selected && idx !== q.correctAnswer ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : ''}
                      ${answered && idx !== q.correctAnswer && idx !== selected ? 'opacity-50' : ''}
                    `}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-bold mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>

              {answered && (
                <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm" data-testid="answer-explanation">
                  <p className="font-semibold mb-1">
                    {selected === q.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                  </p>
                  <p className="text-muted-foreground">{q.explanation}</p>
                </div>
              )}

              {answered && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={nextQuestion} data-testid="next-question">
                    {currentQ + 1 < activeQuiz.questions.length ? 'Next Question' : 'View Results'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to categories
            </button>
            <button
              onClick={() => startQuiz(activeQuiz.category)}
              data-testid="restart-quiz"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ↺ Restart Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result view
  if (activeQuiz && showResult) {
    const pct = Math.round((score / activeQuiz.questions.length) * 100);
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" data-testid="quiz-results">
        <div className="mx-auto max-w-md text-center">
          <Card>
            <CardContent className="py-12">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${pct >= 70 ? 'text-saffron' : 'text-muted-foreground'}`} />
              <h2 className="text-2xl font-bold mb-2">
                {pct >= 70 ? 'Great Job! 🎉' : pct >= 40 ? 'Good Effort! 👍' : 'Keep Learning! 📚'}
              </h2>
              <p className="text-4xl font-bold gradient-text mb-2" data-testid="quiz-score">{pct}%</p>
              <p className="text-muted-foreground mb-6">
                {score} out of {activeQuiz.questions.length} correct
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => startQuiz(activeQuiz.category)} data-testid="restart-quiz">Retry</Button>
                <Button variant="outline" onClick={() => setActiveQuiz(null)}>
                  All Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy/10 dark:bg-blue-400/10 border border-navy/20 dark:border-blue-400/20 px-4 py-1.5 mb-4">
            <HelpCircle className="w-4 h-4 text-navy dark:text-blue-400" />
            <span className="text-sm font-medium text-navy dark:text-blue-400">Test Your Knowledge</span>
          </div>
          <h1>
            <span className="gradient-text">Election Quizzes</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Challenge yourself with quizzes across 5 categories. Earn badges and climb the leaderboard!
          </p>
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedDifficulty === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setSelectedDifficulty(d.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedDifficulty === d.value
                  ? 'bg-primary text-primary-foreground'
                  : `${d.color}`
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Quiz Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizCategories.map((cat) => (
            <Card key={cat.id} hover data-testid="quiz-category-card" className={`bg-gradient-to-br ${cat.color} border-0`}>
              <CardContent className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center mb-4 shadow-sm">
                  <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid="quiz-category-title">{cat.title}</h3>
                <p className="text-sm text-muted-foreground flex-1 mb-4">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~5 min
                  </span>
                  <Button size="sm" data-testid={`start-quiz-${cat.id}`} onClick={() => startQuiz(cat.id)}>
                    Start Quiz
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
