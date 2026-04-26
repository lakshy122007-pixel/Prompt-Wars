/**
 * @module Auth Store
 * @description Zustand store for managing authentication state.
 */

import { create } from 'zustand';
import type { UserProfile } from '@/types/auth';

interface AuthStoreState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    }),
}));
