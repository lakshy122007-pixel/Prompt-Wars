import { describe, it, expect } from 'vitest';
import { signUpSchema, activitySchema, goalSchema } from '@ecotrack/shared';

describe('validationSchemas', () => {
  describe('signUpSchema', () => {
    it('passes on valid registration details', () => {
      const data = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        acceptedTerms: true
      };
      const result = signUpSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects short passwords', () => {
      const data = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Short1',
        confirmPassword: 'Short1',
        acceptedTerms: true
      };
      const result = signUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects passwords without numbers', () => {
      const data = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'NoNumbersHere!',
        confirmPassword: 'NoNumbersHere!',
        acceptedTerms: true
      };
      const result = signUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects passwords from common list', () => {
      const data = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptedTerms: true
      };
      const result = signUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects non-matching confirmPassword', () => {
      const data = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'DifferentSecurePassword123!',
        acceptedTerms: true
      };
      const result = signUpSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('activitySchema', () => {
    it('passes for valid activity logs', () => {
      const data = {
        category: 'transport',
        subtype: 'car_petrol',
        quantity: 15,
        loggedAt: new Date().toISOString()
      };
      const result = activitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects negative quantity', () => {
      const data = {
        category: 'transport',
        subtype: 'car_petrol',
        quantity: -5,
        loggedAt: new Date().toISOString()
      };
      const result = activitySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects future loggedAt dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const data = {
        category: 'food',
        subtype: 'beef',
        quantity: 2,
        loggedAt: tomorrow.toISOString()
      };
      const result = activitySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects quantities above sanity ceilings', () => {
      const data = {
        category: 'transport',
        subtype: 'car_petrol',
        quantity: 25000, // Ceiling is 20000
        loggedAt: new Date().toISOString()
      };
      const result = activitySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('goalSchema', () => {
    it('rejects past target dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const data = {
        category: 'overall',
        type: 'percent_reduction',
        targetValue: 20,
        targetDate: yesterday.toISOString()
      };
      const result = goalSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('passes for future target dates', () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const data = {
        category: 'overall',
        type: 'percent_reduction',
        targetValue: 20,
        targetDate: nextYear.toISOString()
      };
      const result = goalSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
