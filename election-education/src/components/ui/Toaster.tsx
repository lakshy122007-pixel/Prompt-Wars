/**
 * @module Toaster Component
 * @description Simple toast notification system.
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextValue {
  addToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Return a no-op if used outside provider for safety
    return { addToast: () => {} };
  }
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in-right',
              'backdrop-blur-xl border',
              toast.type === 'success' && 'bg-green-500/90 text-white border-green-400/30',
              toast.type === 'error' && 'bg-red-500/90 text-white border-red-400/30',
              toast.type === 'warning' && 'bg-amber-500/90 text-white border-amber-400/30',
              toast.type === 'info' && 'bg-blue-500/90 text-white border-blue-400/30'
            )}
            role="alert"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const Toaster: React.FC = () => {
  return null; // Toasts are rendered by ToastProvider
};
