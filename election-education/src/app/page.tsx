/**
 * @module Home Page
 * @description Landing page with hero, features, stats, and CTA sections.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ROUTES } from '@/lib/constants/routes';
import {
  BookOpen,
  HelpCircle,
  Bot,
  MapPin,
  UserCheck,
  Newspaper,
  ArrowRight,
  Globe,
  Shield,
  Mic,
  CheckCircle2,
  Vote,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Interactive Learning',
    description: 'Step-by-step modules covering every aspect of Indian elections — from voter registration to result declaration.',
    href: ROUTES.LEARN,
    color: 'from-saffron/20 to-saffron/5',
    iconColor: 'text-saffron',
  },
  {
    icon: HelpCircle,
    title: 'Adaptive Quizzes',
    description: 'Test your knowledge with AI-powered quizzes that adapt to your learning level across 5 categories.',
    href: ROUTES.QUIZ,
    color: 'from-navy-300/20 to-navy-300/5',
    iconColor: 'text-navy dark:text-blue-400',
  },
  {
    icon: Bot,
    title: 'AI Election Assistant',
    description: 'Ask anything about elections in your language. Powered by Gemini 2.0 with real-time streaming.',
    href: ROUTES.ASSISTANT,
    color: 'from-india-green/20 to-india-green/5',
    iconColor: 'text-india-green',
  },
  {
    icon: MapPin,
    title: 'Polling Station Finder',
    description: 'Locate your nearest polling booth with Google Maps integration, directions, and accessibility info.',
    href: ROUTES.POLLING_STATION,
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-500',
  },
  {
    icon: UserCheck,
    title: 'Voter Eligibility Check',
    description: 'Instantly verify if you are eligible to vote and get guided steps for registration.',
    href: ROUTES.VOTER_CHECK,
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-500',
  },
  {
    icon: Newspaper,
    title: 'Election News Hub',
    description: 'Stay updated with the latest election news, commission announcements, and civic updates.',
    href: ROUTES.NEWS,
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-500',
  },
];

const stats = [
  { label: 'Registered Voters', value: '97Cr+', icon: Users },
  { label: 'Polling Stations', value: '10L+', icon: Vote },
  { label: 'Languages Supported', value: '23', icon: Globe },
  { label: 'Learning Modules', value: '8+', icon: Award },
];

const highlights = [
  { icon: Globe, text: '23 Indian languages supported' },
  { icon: Shield, text: 'Privacy-first design' },
  { icon: Mic, text: 'Text-to-Speech for accessibility' },
  { icon: Sparkles, text: 'AI-powered personalization' },
];

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Extract number portion for animation
    const numMatch = target.match(/^(\d+)/);
    if (!numMatch) {
      setDisplay(target);
      return;
    }
    const end = parseInt(numMatch[1]);
    const rest = target.slice(numMatch[1].length);
    let current = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(end / (duration / 16)));

    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      setDisplay(`${current}${rest}`);
      if (current >= end) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-india-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-navy/10 rounded-full blur-3xl" />
      </div>

      {/* ───── Hero Section ───── */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-saffron/10 border border-saffron/20 px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span className="text-sm font-medium text-saffron-dark dark:text-saffron">
              AI-Powered Election Education
            </span>
          </div>

          <h1 className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">Empowering Every Indian</span>
            <br />
            <span className="text-foreground">to Understand Democracy</span>
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Learn about the election process, check your eligibility, find your polling station,
            and become an informed voter — all in your preferred language.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <Link href={ROUTES.LEARN}>
              <Button variant="primary" size="lg">
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href={ROUTES.ASSISTANT}>
              <Button variant="outline" size="lg">
                <Bot className="w-5 h-5" />
                Ask AI Assistant
              </Button>
            </Link>
          </div>

          {/* Highlights */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <h.icon className="w-4 h-4 text-india-green" />
                {h.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Stats Section ───── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} variant="glass" className="text-center py-8">
                <CardContent>
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-saffron" />
                  <div className="text-3xl font-bold font-display text-foreground">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features Section ───── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-foreground">
              Everything You Need to{' '}
              <span className="gradient-text">Know About Elections</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From learning the basics to finding your polling booth — we have got you covered with
              AI-powered tools built for every Indian citizen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card hover className={`h-full bg-gradient-to-br ${feature.color} border-0`}>
                  <CardContent className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center mb-4 shadow-sm`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How It Works Section ───── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-foreground">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to become an informed, empowered voter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Language',
                desc: 'Select from 23 Indian languages. All content, quizzes, and AI responses adapt to your choice.',
              },
              {
                step: '02',
                title: 'Learn at Your Pace',
                desc: 'Go through interactive modules, take quizzes, or ask the AI assistant any election-related question.',
              },
              {
                step: '03',
                title: 'Take Action',
                desc: 'Check your eligibility, find your polling station, and step into the booth with confidence.',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-saffron to-india-green text-white text-2xl font-bold font-display mb-6">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card variant="glass" className="py-12 px-8">
            <CardContent>
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-india-green" />
              <h2 className="text-foreground mb-4">
                Ready to Become an{' '}
                <span className="gradient-text">Informed Voter?</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join millions of Indians learning about their democratic rights. It takes just 5 minutes to get started.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={ROUTES.LEARN}>
                  <Button variant="primary" size="lg">
                    <BookOpen className="w-5 h-5" />
                    Start Learning Now
                  </Button>
                </Link>
                <Link href={ROUTES.VOTER_CHECK}>
                  <Button variant="accent" size="lg">
                    <UserCheck className="w-5 h-5" />
                    Check Eligibility
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
