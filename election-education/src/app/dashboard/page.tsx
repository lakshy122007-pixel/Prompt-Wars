/**
 * @module Dashboard Page
 * @description User dashboard showing progress, quiz results, and quick actions.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants/routes';
import {
  BookOpen,
  HelpCircle,
  Bot,
  MapPin,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-saffron" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Sign In to View Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Track your learning progress, quiz scores, and achievements.
            </p>
            <Link href={ROUTES.LOGIN}>
              <Button variant="primary">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickActions = [
    { icon: BookOpen, label: 'Continue Learning', href: ROUTES.LEARN, color: 'text-saffron', bg: 'bg-saffron/10' },
    { icon: HelpCircle, label: 'Take a Quiz', href: ROUTES.QUIZ, color: 'text-navy dark:text-blue-400', bg: 'bg-navy/10 dark:bg-blue-400/10' },
    { icon: Bot, label: 'Ask AI', href: ROUTES.ASSISTANT, color: 'text-india-green', bg: 'bg-india-green/10' },
    { icon: MapPin, label: 'Find Booth', href: ROUTES.POLLING_STATION, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back,{' '}
            <span className="gradient-text">
              {user?.displayName || 'Voter'}
            </span>
            ! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s an overview of your learning journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, label: 'Quizzes Taken', value: user?.quizProgress?.length || 0, color: 'text-saffron' },
            { icon: Flame, label: 'Current Streak', value: '0 days', color: 'text-red-500' },
            { icon: TrendingUp, label: 'Avg Score', value: '—', color: 'text-india-green' },
            { icon: Clock, label: 'Time Spent', value: '—', color: 'text-blue-500' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card hover className="text-center">
                  <CardContent className="py-6">
                    <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning and quiz activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No recent activity yet.</p>
                <Link href={ROUTES.LEARN} className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
                  Start Learning <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and milestones you have earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Complete quizzes and modules to earn badges!</p>
                <Link href={ROUTES.QUIZ} className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
                  Take a Quiz <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
