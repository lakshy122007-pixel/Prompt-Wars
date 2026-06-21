import { useCallback, useRef } from 'react';

/**
 * Custom hook for translating text dynamically using /api/translate.
 * Caches translations and falls back to original text on error.
 */
export function useTranslation(languageCode: string) {
  const cacheRef = useRef<Record<string, string>>({});

  const translate = useCallback(async (text: string): Promise<string> => {
    if (languageCode === 'en' || !text.trim()) {
      return text;
    }

    const cacheKey = `${languageCode}:${text}`;
    if (cacheRef.current[cacheKey]) {
      return cacheRef.current[cacheKey];
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      try {
        const { getIdToken } = await import('@/lib/firebase/auth');
        const token = await getIdToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch {
        // Ignore auth retrieval errors
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text,
          targetLanguage: languageCode,
        }),
      });

      if (!res.ok) {
        throw new Error('Translation failed');
      }

      const json = await res.json();
      const translated = json.data?.translatedText || text;
      
      cacheRef.current[cacheKey] = translated;
      return translated;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Translation error:', err);
      return text;
    }
  }, [languageCode]);

  return { translate };
}
