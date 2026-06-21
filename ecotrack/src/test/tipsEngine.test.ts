import { describe, it, expect } from 'vitest';
import { getTopCategory, selectTips, CategoryTotals, Tip } from '@ecotrack/shared';

describe('tipsEngine', () => {
  describe('getTopCategory', () => {
    it('correctly returns transport when it has the highest emissions', () => {
      const summary: CategoryTotals = {
        transport: 150.5,
        energy: 120.0,
        food: 45.2,
        waste: 10.1,
        water: 5.4
      };
      expect(getTopCategory(summary)).toBe('transport');
    });

    it('correctly handles ties by prioritizing the first matching max', () => {
      const summary: CategoryTotals = {
        transport: 100.0,
        energy: 100.0,
        food: 50.0,
        waste: 10.0,
        water: 5.0
      };
      // Order of iteration: transport, energy, food, waste, water.
      // So first encountered is 'transport'
      expect(getTopCategory(summary)).toBe('transport');
    });
  });

  describe('selectTips', () => {
    const mockTips: Tip[] = [
      {
        id: 't1',
        title: 'Carpooling',
        category: 'transport',
        description: 'Carpool to save fuel',
        estimatedAnnualSavingsKg: 300,
        moneySavingDescription: 'Save $200'
      },
      {
        id: 't2',
        title: 'Biking',
        category: 'transport',
        description: 'Ride a bicycle instead',
        estimatedAnnualSavingsKg: 600,
        moneySavingDescription: 'Save $400'
      },
      {
        id: 't3',
        title: 'LED lights',
        category: 'energy',
        description: 'Switch to LEDs',
        estimatedAnnualSavingsKg: 100,
        moneySavingDescription: 'Save $50'
      },
      {
        id: 't4',
        title: 'Public Transit',
        category: 'transport',
        description: 'Take the bus',
        estimatedAnnualSavingsKg: 450,
        moneySavingDescription: 'Save $300'
      }
    ];

    it('filters tips by top category and sorts them by savings descending', () => {
      const selected = selectTips('transport', mockTips);
      expect(selected).toHaveLength(3);
      // Sorted desc: t2 (600) -> t4 (450) -> t1 (300)
      expect(selected[0].id).toBe('t2');
      expect(selected[1].id).toBe('t4');
      expect(selected[2].id).toBe('t1');
    });
  });
});
