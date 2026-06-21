import { describe, it, expect } from 'vitest';
import { calculateActivityCo2e, UnknownSubtypeError } from '@ecotrack/shared';

describe('calculateActivityCo2e', () => {
  it('correctly calculates petrol car emissions', () => {
    const result = calculateActivityCo2e({
      category: 'transport',
      subtype: 'car_petrol',
      quantity: 100
    });
    expect(result.co2eKg).toBe(19.2); // 100 * 0.192
    expect(result.factorUsed).toBe(0.192);
    expect(result.sourceLabel).toContain('DEFRA');
  });

  it('correctly calculates electricity emissions', () => {
    const result = calculateActivityCo2e({
      category: 'energy',
      subtype: 'electricity_grid',
      quantity: 50
    });
    expect(result.co2eKg).toBe(21.0); // 50 * 0.42
    expect(result.factorUsed).toBe(0.42);
    expect(result.sourceLabel).toContain('EPA');
  });

  it('handles zero quantity', () => {
    const result = calculateActivityCo2e({
      category: 'food',
      subtype: 'beef',
      quantity: 0
    });
    expect(result.co2eKg).toBe(0);
  });

  it('throws on negative quantity', () => {
    expect(() => {
      calculateActivityCo2e({
        category: 'water',
        subtype: 'water_treated',
        quantity: -10
      });
    }).toThrow('Quantity cannot be negative');
  });

  it('throws UnknownSubtypeError on unknown subtype', () => {
    expect(() => {
      calculateActivityCo2e({
        category: 'transport',
        subtype: 'spaceship',
        quantity: 10
      });
    }).toThrow(UnknownSubtypeError);
  });
});
