// tests/unit/hooks/useTranslation.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useTranslation } from '@/hooks/useTranslation';

describe('useTranslation', () => {
  it('returns original text when language is English', async () => {
    const { result } = renderHook(() => useTranslation('en'));
    const translated = await result.current.translate('Hello World');
    expect(translated).toBe('Hello World');
  });

  it('calls translate API for non-English languages', async () => {
    const { result } = renderHook(() => useTranslation('hi'));
    await waitFor(async () => {
      const translated = await result.current.translate('Hello');
      expect(translated).toContain('[hi]');
    });
  });

  it('caches translations to avoid duplicate API calls', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { result } = renderHook(() => useTranslation('ta'));
    await result.current.translate('Test');
    await result.current.translate('Test');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('handles translation errors gracefully', async () => {
    const { result } = renderHook(() => useTranslation('hi'));
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    const translated = await result.current.translate('Fallback test');
    expect(translated).toBe('Fallback test');
  });
});
