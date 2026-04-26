/**
 * @module Learn Module Detail Page
 * @description Individual learning module with lessons and content.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';

// Module content data
const moduleData: Record<string, {
  title: string;
  description: string;
  lessons: { id: string; title: string; content: string; keyPoints: string[]; estimatedMinutes: number }[];
}> = {
  'voter-registration': {
    title: 'Voter Registration',
    description: 'Learn how to register as a voter in India — eligibility, documents, and step-by-step process.',
    lessons: [
      {
        id: 'eligibility',
        title: 'Who Can Vote?',
        content: `Every Indian citizen who has attained the age of 18 years on the qualifying date (1st January of the year of revision of electoral roll) is eligible to be registered as a voter.\n\nAccording to Section 19 of the Representation of the People Act, 1950, the following conditions must be met:\n\n• You must be a citizen of India\n• You must have attained the age of 18 years on the qualifying date\n• You must be a resident of the constituency where you wish to register\n• You must not be disqualified under any law\n\nPersons of unsound mind, those convicted of certain offences, and non-citizens are not eligible to vote.`,
        keyPoints: [
          'Minimum age: 18 years on January 1st of the revision year',
          'Must be an Indian citizen',
          'Must be ordinary resident of the constituency',
          'Cannot be of unsound mind or disqualified by law',
        ],
        estimatedMinutes: 5,
      },
      {
        id: 'form-6',
        title: 'Applying with Form 6',
        content: `Form 6 is the application form for inclusion of name in the electoral roll. You can submit it:\n\n1. Online through the National Voters' Service Portal (voters.eci.gov.in)\n2. Through the Voter Helpline App\n3. At the ERO/AERO office of your constituency\n4. Through Booth Level Officers (BLOs)\n\nDocuments required:\n• Proof of age: Birth certificate, school leaving certificate, passport, etc.\n• Proof of address: Aadhaar, utility bill, bank passbook, ration card, etc.\n• Passport-size photograph (recent)\n\nThe form requires your personal details, current address, and details of the constituency where you wish to register.`,
        keyPoints: [
          'Form 6 can be submitted online or offline',
          'Need proof of age and proof of address',
          'Recent passport-size photo required',
          'BLOs can help with the application at your doorstep',
        ],
        estimatedMinutes: 4,
      },
      {
        id: 'verification',
        title: 'Verification Process',
        content: `After submitting Form 6, a Booth Level Officer (BLO) is assigned to verify your details:\n\n1. The BLO visits your registered address to confirm residency\n2. They verify your identity and age from supporting documents\n3. The BLO submits a verification report to the ERO\n4. The ERO reviews and may publish your name in a draft roll for objections\n5. After the objection period, if no valid objections, your name is included\n\nThe typical verification process takes 2-4 weeks. You can track your application status online at voters.eci.gov.in.\n\nIf your application is rejected, you will receive reasons and can reapply with corrected information.`,
        keyPoints: [
          'BLO visits your address for physical verification',
          'Process takes 2-4 weeks typically',
          'Application status can be tracked online',
          'Rejection reasons are provided if applicable',
        ],
        estimatedMinutes: 3,
      },
      {
        id: 'epic',
        title: 'Your Voter ID (EPIC)',
        content: `The Electoral Photo Identity Card (EPIC), commonly known as the Voter ID card, is issued after successful registration. Key facts:\n\n• It serves as proof of identity for voting\n• It contains your photo, name, father's/mother's name, gender, date of birth, and address\n• Each EPIC has a unique Voter ID number (e.g., ABC1234567)\n• e-EPIC (digital version) is now available through DigiLocker\n\nImportant: The EPIC is NOT mandatory for voting. You can vote using 12 other approved identity documents:\n1. Passport\n2. Driving License\n3. Aadhaar Card\n4. PAN Card\n5. Service ID cards (government employees)\n6. Bank/Post Office passbook with photo\n7. And more...\n\nTo update details on your EPIC, use Form 8 (for corrections) or Form 8A (for transposition within the constituency).`,
        keyPoints: [
          'EPIC is your Voter ID card with unique number',
          'e-EPIC available on DigiLocker',
          'EPIC is NOT mandatory — 12 other IDs accepted',
          'Use Form 8 for corrections, Form 8A for transposition',
        ],
        estimatedMinutes: 4,
      },
    ],
  },
  'voting-process': {
    title: 'The Voting Process',
    description: 'Complete walkthrough of what happens on polling day.',
    lessons: [
      {
        id: 'polling-day',
        title: 'Polling Day Overview',
        content: `Polling typically takes place from 7:00 AM to 6:00 PM. Here's what happens:\n\n1. Polling stations open after mock poll demonstration\n2. Voters queue up in orderly lines\n3. Priority is given to elderly, disabled, and pregnant women\n4. Indelible ink is applied to the left index finger\n5. Identity verification at multiple checkpoints\n6. Secret ballot is maintained throughout\n\nKey rules:\n• No campaigning within 100 meters of a polling station\n• No phones or cameras inside the voting compartment\n• Polling agents of candidates can be present to observe`,
        keyPoints: [
          'Polling hours: 7:00 AM to 6:00 PM',
          'Indelible ink applied to left index finger',
          'Priority queue for elderly, disabled, pregnant women',
          'No phones inside voting compartment',
        ],
        estimatedMinutes: 4,
      },
      {
        id: 'evm-voting',
        title: 'Voting on the EVM',
        content: `Inside the voting compartment, you will find the Electronic Voting Machine (EVM) Ballot Unit:\n\n1. The ballot unit displays candidate names, party symbols, and serial numbers\n2. Press the blue button next to your chosen candidate\n3. A beep sound confirms your vote has been recorded\n4. The VVPAT slip prints and displays for 7 seconds\n5. Verify your choice on the VVPAT slip\n6. Exit the compartment\n\nThe NOTA option (None Of The Above) is always the last button on the ballot unit. You may choose it if you don't wish to vote for any candidate.\n\nImportant: You can only press ONE button. The EVM locks after the first press, ensuring one vote per person.`,
        keyPoints: [
          'Press blue button next to your chosen candidate',
          'VVPAT slip displays for 7 seconds for verification',
          'NOTA is the last option on the ballot unit',
          'EVM locks after first button press',
        ],
        estimatedMinutes: 4,
      },
    ],
  },
};

// Fallback for modules that don't have content yet
const fallbackModule = {
  title: 'Module Content',
  description: 'This module content is being prepared. Check back soon!',
  lessons: [
    {
      id: 'coming-soon',
      title: 'Coming Soon',
      content: 'Detailed lesson content for this module is being prepared by our education team. In the meantime, try using the AI Assistant to ask questions about this topic!',
      keyPoints: ['Content is being prepared', 'Use AI Assistant for instant answers'],
      estimatedMinutes: 1,
    },
  ],
};

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const mod = moduleData[moduleId] || { ...fallbackModule, title: moduleId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') };
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [expandedKeyPoints, setExpandedKeyPoints] = useState(true);

  const lesson = mod.lessons[currentLesson];
  const progress = (completedLessons.size / mod.lessons.length) * 100;

  const markComplete = () => {
    setCompletedLessons((prev) => new Set(prev).add(lesson.id));
    if (currentLesson < mod.lessons.length - 1) {
      setCurrentLesson((i) => i + 1);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          href={ROUTES.LEARN}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Modules
        </Link>

        {/* Module Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">{mod.title}</h1>
          <p className="mt-2 text-muted-foreground">{mod.description}</p>
          
          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron to-india-green transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {completedLessons.size}/{mod.lessons.length} complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-sm">Lessons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-3">
                {mod.lessons.map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      idx === currentLesson
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {completedLessons.has(l.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 shrink-0 opacity-40" />
                    )}
                    <span className="truncate">{l.title}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{lesson.title}</CardTitle>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.estimatedMinutes} min read
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                  {lesson.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Key Points */}
                <div className="rounded-xl bg-saffron/5 border border-saffron/20 p-4 mb-6">
                  <button
                    onClick={() => setExpandedKeyPoints(!expandedKeyPoints)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-saffron-dark dark:text-saffron"
                  >
                    <span className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Key Points
                    </span>
                    {expandedKeyPoints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedKeyPoints && (
                    <ul className="mt-3 space-y-2">
                      {lesson.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-india-green shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentLesson === 0}
                    onClick={() => setCurrentLesson((i) => i - 1)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {completedLessons.has(lesson.id) ? (
                    <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <Button variant="primary" size="sm" onClick={markComplete}>
                      Mark Complete
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentLesson >= mod.lessons.length - 1}
                    onClick={() => setCurrentLesson((i) => i + 1)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
