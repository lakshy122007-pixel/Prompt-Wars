/**
 * @module Voter Check Page
 * @description Voter eligibility verification form with instant results.
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  UserCheck,
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  state: string;
  hasVoterId: string;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman & Nicobar', 'Dadra & Nagar Haveli', 'Lakshadweep',
];

export default function VoterCheckPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    nationality: 'Indian',
    state: '',
    hasVoterId: '',
  });
  const [result, setResult] = useState<{
    eligible: boolean;
    reasons: string[];
    steps: string[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    setTimeout(() => {
      const age = calculateAge(formData.dateOfBirth);
      const isIndian = formData.nationality === 'Indian';
      const isOldEnough = age >= 18;
      const eligible = isIndian && isOldEnough;

      const reasons: string[] = [];
      const steps: string[] = [];

      if (!isIndian) {
        reasons.push('Only Indian citizens are eligible to vote in Indian elections.');
      }
      if (!isOldEnough) {
        reasons.push(`You must be at least 18 years old. You are currently ${age} years old.`);
        if (age >= 17) {
          steps.push('You can apply for voter registration 6 months before turning 18 using Form 6.');
        }
      }
      if (eligible) {
        reasons.push('You meet the age and nationality requirements for voter eligibility!');
        if (formData.hasVoterId === 'no') {
          steps.push('Visit voters.eci.gov.in to register online using Form 6.');
          steps.push('Prepare documents: proof of age, address proof, and passport-size photo.');
          steps.push('You can also visit your nearest ERO (Electoral Registration Officer) office.');
        } else {
          steps.push('Your voter ID is valid. Check your polling station details at voters.eci.gov.in.');
          steps.push('Make sure your details on the voter ID are up to date.');
        }
      }

      setResult({ eligible, reasons, steps });
      setIsChecking(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 mb-4">
            <UserCheck className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Eligibility Checker</span>
          </div>
          <h1>
            <span className="gradient-text">Check Your Voter Eligibility</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Quickly verify if you are eligible to vote and get personalized next steps.
          </p>
        </div>

        {/* Form */}
        {!result ? (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter your details below. This information is processed locally and never stored.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1.5">
                    State / Union Territory
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                    >
                      <option value="">Select your state</option>
                      {indianStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Has Voter ID */}
                <div>
                  <div id="voter-id-label" className="block text-sm font-medium mb-2">
                    Do you have a Voter ID (EPIC)?
                  </div>
                  <div role="radiogroup" aria-labelledby="voter-id-label" className="flex gap-4">
                    {['yes', 'no'].map((opt) => (
                      <label
                        key={opt}
                        htmlFor={`voter-id-${opt}`}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                          formData.hasVoterId === opt
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          id={`voter-id-${opt}`}
                          type="radio"
                          name="hasVoterId"
                          value={opt}
                          checked={formData.hasVoterId === opt}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.hasVoterId === opt ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {formData.hasVoterId === opt && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </span>
                        {opt === 'yes' ? 'Yes, I have' : 'No, I don\'t'}
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isChecking}>
                  <Sparkles className="w-5 h-5" />
                  Check Eligibility
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Results */
          <div className="space-y-6 animate-fade-in">
            <Card className={result.eligible ? 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10' : 'border-red-500/30 bg-red-50/50 dark:bg-red-900/10'}>
              <CardContent className="py-8 text-center">
                {result.eligible ? (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                      You Are Eligible to Vote! 🎉
                    </h2>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                      Not Eligible Currently
                    </h2>
                  </>
                )}

                {result.reasons.map((reason, i) => (
                  <p key={i} className="text-muted-foreground">{reason}</p>
                ))}
              </CardContent>
            </Card>

            {result.steps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {result.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://voters.eci.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="sm">
                        <ExternalLink className="w-4 h-4" />
                        Visit National Voters Portal
                      </Button>
                    </a>
                    <Button variant="outline" size="sm" onClick={() => setResult(null)}>
                      Check Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card variant="glass">
              <CardContent className="flex items-start gap-3 py-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  This is an educational tool providing preliminary guidance only. For official verification,
                  visit{' '}
                  <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    voters.eci.gov.in
                  </a>{' '}
                  or contact your local ERO office.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
