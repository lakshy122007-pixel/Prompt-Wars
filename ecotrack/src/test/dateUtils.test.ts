import { describe, it, expect } from 'vitest';
import { getISOWeekString, getDateISOString, getMonthISOString } from '@ecotrack/shared';

describe('dateUtils', () => {
  it('correctly returns date ISO strings', () => {
    const d = new Date('2026-06-21T00:00:00.000Z');
    expect(getDateISOString(d)).toBe('2026-06-21');
  });

  it('correctly returns month ISO strings', () => {
    const d = new Date('2026-06-21T00:00:00.000Z');
    expect(getMonthISOString(d)).toBe('2026-06');
  });

  it('correctly calculates ISO week strings', () => {
    // 2026-06-21 is a Sunday. ISO week is 2026-W25.
    const d = new Date('2026-06-21T12:00:00.000Z');
    expect(getISOWeekString(d)).toBe('2026-W25');
  });
});
