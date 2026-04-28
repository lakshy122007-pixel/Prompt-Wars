/**
 * @module Login Page
 * @description Authentication page with Google sign-in and guest access.
 * Supports loading states and error display.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase/auth';
import { ROUTES } from '@/lib/constants/routes';
import { getErrorMessage } from '@/lib/utils/errors';
import { User, Shield, Sparkles, ArrowRight } from 'lucide-react';

/** Loading indicator for which auth method is in progress */
type AuthLoadingState = 'google' | 'guest' | null;

/**
 * Login page component with Google OAuth and anonymous guest sign-in.
 *
 * @returns The login page UI
 */
export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<AuthLoadingState>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles Google sign-in flow
   */
  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading('google');
    setError(null);
    try {
      await signInWithGoogle();
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(null);
    }
  };

  /**
   * Handles anonymous guest sign-in flow
   */
  const handleGuestSignIn = async (): Promise<void> => {
    setIsLoading('guest');
    setError(null);
    try {
      await signInAsGuest();
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-india-green/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <Card variant="glass" className="py-10 px-8">
          <CardContent className="text-center">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron to-india-green flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Welcome to ElectionEdu</h1>
            <p className="text-muted-foreground mb-8">
              Sign in to track your progress and access all features.
            </p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm" role="alert">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Google Sign In */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleGoogleSignIn}
                isLoading={isLoading === 'google'}
                disabled={!!isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Guest Sign In */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGuestSignIn}
                isLoading={isLoading === 'guest'}
                disabled={!!isLoading}
              >
                <User className="w-5 h-5" />
                Continue as Guest
              </Button>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-4">What you get with an account:</p>
              <div className="space-y-2">
                {[
                  'Track learning progress across modules',
                  'Save quiz scores & climb the leaderboard',
                  'Personalized AI assistant conversations',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="w-3 h-3 text-india-green" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Your data is encrypted and never shared
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
