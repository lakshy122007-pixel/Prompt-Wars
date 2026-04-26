/**
 * @module Learn Page
 * @description Learning modules overview with progress tracking.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { ROUTES } from '@/lib/constants/routes';
import {
  BookOpen,
  FileText,
  Scale,
  Vote,
  Users,
  Shield,
  Globe,
  Landmark,
  ArrowRight,
  Clock,
  BarChart3,
} from 'lucide-react';
import type { ModuleDifficulty } from '@/types/election';

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedMinutes: number;
  difficulty: ModuleDifficulty;
  lessons: number;
  color: string;
  iconBg: string;
}

const modules: ModuleCard[] = [
  {
    id: 'voter-registration',
    title: 'Voter Registration',
    description: 'Learn how to register as a voter, required documents, and the complete process using Form 6.',
    icon: FileText,
    estimatedMinutes: 15,
    difficulty: 'beginner',
    lessons: 4,
    color: 'border-l-saffron',
    iconBg: 'bg-saffron/10 text-saffron',
  },
  {
    id: 'election-commission',
    title: 'Election Commission of India',
    description: 'Understand the structure, powers, and responsibilities of the ECI under Articles 324-329.',
    icon: Landmark,
    estimatedMinutes: 20,
    difficulty: 'intermediate',
    lessons: 5,
    color: 'border-l-navy dark:border-l-blue-400',
    iconBg: 'bg-navy/10 dark:bg-blue-400/10 text-navy dark:text-blue-400',
  },
  {
    id: 'voting-process',
    title: 'The Voting Process',
    description: 'A complete walkthrough of polling day — from entering the booth to casting your vote via EVM.',
    icon: Vote,
    estimatedMinutes: 20,
    difficulty: 'beginner',
    lessons: 6,
    color: 'border-l-india-green',
    iconBg: 'bg-india-green/10 text-india-green',
  },
  {
    id: 'constitutional-provisions',
    title: 'Constitutional Provisions',
    description: 'Key constitutional articles, Representation of the People Act, and electoral law fundamentals.',
    icon: Scale,
    estimatedMinutes: 30,
    difficulty: 'advanced',
    lessons: 7,
    color: 'border-l-purple-500',
    iconBg: 'bg-purple-500/10 text-purple-500',
  },
  {
    id: 'election-types',
    title: 'Types of Elections',
    description: 'Lok Sabha, Rajya Sabha, Vidhan Sabha, Panchayat, and Municipal elections explained.',
    icon: Users,
    estimatedMinutes: 25,
    difficulty: 'beginner',
    lessons: 5,
    color: 'border-l-amber-500',
    iconBg: 'bg-amber-500/10 text-amber-500',
  },
  {
    id: 'evm-vvpat',
    title: 'EVM & VVPAT Technology',
    description: 'How Electronic Voting Machines and Voter Verifiable Paper Audit Trail systems work.',
    icon: Shield,
    estimatedMinutes: 15,
    difficulty: 'intermediate',
    lessons: 3,
    color: 'border-l-teal-500',
    iconBg: 'bg-teal-500/10 text-teal-500',
  },
  {
    id: 'model-code-of-conduct',
    title: 'Model Code of Conduct',
    description: 'Rules governing political parties and candidates during elections to ensure free and fair polls.',
    icon: BookOpen,
    estimatedMinutes: 20,
    difficulty: 'intermediate',
    lessons: 4,
    color: 'border-l-rose-500',
    iconBg: 'bg-rose-500/10 text-rose-500',
  },
  {
    id: 'voter-rights',
    title: 'Voter Rights & Duties',
    description: 'Your fundamental rights as a voter, NOTA option, and duties for preserving democracy.',
    icon: Globe,
    estimatedMinutes: 15,
    difficulty: 'beginner',
    lessons: 4,
    color: 'border-l-cyan-500',
    iconBg: 'bg-cyan-500/10 text-cyan-500',
  },
];

const difficultyColors: Record<ModuleDifficulty, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function LearnPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-saffron/10 border border-saffron/20 px-4 py-1.5 mb-4">
            <BookOpen className="w-4 h-4 text-saffron" />
            <span className="text-sm font-medium text-saffron-dark dark:text-saffron">Interactive Modules</span>
          </div>
          <h1>
            <span className="gradient-text">Learn About Elections</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive, step-by-step learning modules covering every aspect of the Indian democratic process.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mb-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            {modules.length} Modules
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            {modules.reduce((sum, m) => sum + m.lessons, 0)} Lessons
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            ~{Math.round(modules.reduce((sum, m) => sum + m.estimatedMinutes, 0) / 60)}h Total
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <Link key={mod.id} href={ROUTES.LEARN_MODULE(mod.id)}>
              <Card hover className={`h-full border-l-4 ${mod.color}`}>
                <CardContent className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl ${mod.iconBg} flex items-center justify-center shrink-0`}>
                    <mod.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold truncate">{mod.title}</h3>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${difficultyColors[mod.difficulty]}`}>
                        {mod.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{mod.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {mod.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mod.estimatedMinutes} min
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 self-center" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
