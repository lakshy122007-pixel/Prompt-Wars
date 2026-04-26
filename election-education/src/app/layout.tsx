'use client';

import './globals.css';
import { useEffect, useState, useCallback } from 'react';
import { onAuthChange } from '@/lib/firebase/auth';
import { useAuthStore } from '@/stores/authStore';
import { getUserProfile } from '@/lib/firebase/firestore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/Toaster';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  useEffect(() => {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            // Create minimal profile for first-time users
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
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
              createdAt: null as any,
              lastLoginAt: null as any,
              isAnonymous: firebaseUser.isAnonymous,
            });
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
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
