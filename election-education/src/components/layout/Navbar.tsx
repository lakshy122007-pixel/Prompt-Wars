/**
 * @module Navbar Component
 * @description Main navigation bar with mobile menu, dark mode toggle, and auth controls.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { logger } from '@/lib/utils/logger';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { signInWithGoogle, signInAsGuest, signOut } from '@/lib/firebase/auth';
import { NAV_ITEMS, ROUTES } from '@/lib/constants/routes';
import { LanguageSelector } from '@/components/translate/LanguageSelector';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Bot,
  MapPin,
  UserCheck,
  Newspaper,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Bot,
  MapPin,
  UserCheck,
  Newspaper,
};

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setAuthMenuOpen(false);
    } catch (err: unknown) {
      logger.error('Sign in failed', { error: String(err) });
    }
  };

  const handleGuestSignIn = async () => {
    try {
      await signInAsGuest();
      setAuthMenuOpen(false);
    } catch (err: unknown) {
      logger.error('Guest sign in failed', { error: String(err) });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthMenuOpen(false);
    } catch (err: unknown) {
      logger.error('Sign out failed', { error: String(err) });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 group"
            aria-label="Election Education Home"
          >
            {/* Ashoka Chakra inspired logo */}
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full border-2 border-navy dark:border-saffron chakra-spin">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-2 bg-navy dark:bg-saffron left-1/2 top-0 origin-[50%_18px] -translate-x-1/2"
                    style={{ transform: `translateX(-50%) rotate(${i * 15}deg)` }}
                  />
                ))}
              </div>
              <div className="absolute inset-[6px] rounded-full bg-navy dark:bg-saffron" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold gradient-text">
                ElectionEdu
              </span>
              <span className="block text-[10px] text-muted-foreground -mt-1">
                Learn Democracy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Auth */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setAuthMenuOpen(!authMenuOpen)}
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors"
                  aria-label="User menu"
                >
                  {user?.photoURL ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User avatar'}
                      className="w-8 h-8 rounded-full border-2 border-saffron"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleSignIn} aria-label="Sign in with Google">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}

              {/* Auth dropdown */}
              {authMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg py-2 animate-fade-in">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium truncate">
                          {user?.displayName || 'Guest User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || 'Anonymous'}
                        </p>
                      </div>
                      <Link
                        href={ROUTES.DASHBOARD}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setAuthMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSignIn}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign in with Google
                      </button>
                      <button
                        onClick={handleGuestSignIn}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left"
                      >
                        <User className="w-4 h-4" />
                        Continue as Guest
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in"
          aria-label="Mobile navigation"
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
