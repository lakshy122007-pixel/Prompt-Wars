/**
 * @module Root Layout
 * @description Application shell with auth state management, theme persistence,
 * skip-to-content link, and semantic HTML landmarks.
 */

'use client';

import './globals.css';
import { useEffect, useState, useCallback } from 'react';

import { onAuthChange } from '@/lib/firebase/auth';
import { getUserProfile } from '@/lib/firebase/firestore';
import { STORAGE_KEYS } from '@/lib/constants/app';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/Toaster';
import type { UserProfile } from '@/types/auth';
import type { Timestamp } from 'firebase/firestore';

/**
 * Creates a minimal profile for first-time authenticated users
 * who don't yet have a Firestore document.
 *
 * @param uid - Firebase UID
 * @param email - User email (nullable for anonymous users)
 * @param displayName - User display name (nullable)
 * @param photoURL - User avatar URL (nullable)
 * @param isAnonymous - Whether the user signed in anonymously
 * @returns Partial UserProfile for local state
 */
function createMinimalProfile(
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null,
  isAnonymous: boolean,
): UserProfile {
  return {
    uid,
    email,
    displayName,
    photoURL,
    preferredLanguage: 'en',
    accessibilityPreferences: {
      fontSize: 'normal',
      highContrast: false,
      reducedMotion: false,
      screenReaderMode: false,
      textToSpeech: false,
      keyboardOnly: false,
      dyslexiaFont: false,
    },
    quizProgress: [],
    learnProgress: [],
    createdAt: null as unknown as Timestamp,
    lastLoginAt: null as unknown as Timestamp,
    isAnonymous,
  };
}

/**
 * Root layout component providing global state, theming, and structure.
 *
 * @param props.children - Page content rendered inside the main landmark
 * @returns The full application shell
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { setUser, setLoading } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);

  /** Toggles between light and dark mode */
  const toggleDarkMode = useCallback((): void => {
    setDarkMode((prev) => !prev);
  }, []);

  /** Hydrate theme from localStorage or system preference */
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  /** Persist theme class and localStorage value */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(STORAGE_KEYS.THEME, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /** Subscribe to Firebase auth state changes and hydrate profile */
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            setUser(
              createMinimalProfile(
                firebaseUser.uid,
                firebaseUser.email,
                firebaseUser.displayName,
                firebaseUser.photoURL,
                firebaseUser.isAnonymous,
              ),
            );
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Election Education India — Learn Democracy</title>
        <meta
          name="description"
          content="AI-powered Election Process Education platform for Indian citizens. Learn about voting, elections, and democratic processes in 23 languages."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-to-content" data-testid="skip-to-content" tabIndex={0}>
          Skip to content
        </a>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
