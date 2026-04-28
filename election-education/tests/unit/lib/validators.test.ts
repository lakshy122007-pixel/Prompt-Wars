// tests/unit/lib/validators.test.ts
import { validateVoterEligibility, validateMessage, validatePincode } from '@/lib/utils/validators';

describe('validateVoterEligibility', () => {
  it('returns eligible for 18+ Indian citizen', () => {
    const result = validateVoterEligibility({ age: 18, isCitizen: true, isEnrolled: false });
    expect(result.isEligible).toBe(true);
  });

  it('returns ineligible for under 18', () => {
    const result = validateVoterEligibility({ age: 17, isCitizen: true, isEnrolled: false });
    expect(result.isEligible).toBe(false);
    expect(result.reason).toContain('18');
  });

  it('returns ineligible for non-citizen', () => {
    const result = validateVoterEligibility({ age: 25, isCitizen: false, isEnrolled: false });
    expect(result.isEligible).toBe(false);
  });

  it('handles edge case of exactly 18 years', () => {
    const result = validateVoterEligibility({ age: 18, isCitizen: true, isEnrolled: false });
    expect(result.isEligible).toBe(true);
  });
});

describe('validateMessage', () => {
  it('rejects empty messages', () => {
    expect(validateMessage('').success).toBe(false);
  });

  it('rejects messages over 2000 characters', () => {
    expect(validateMessage('a'.repeat(2001)).success).toBe(false);
  });

  it('accepts valid messages', () => {
    expect(validateMessage('How do I vote?').success).toBe(true);
  });

  it('rejects messages with only whitespace', () => {
    expect(validateMessage('   ').success).toBe(false);
  });
});

describe('validatePincode', () => {
  it('accepts valid 6-digit Indian pincode', () => {
    expect(validatePincode('600001').success).toBe(true);
  });

  it('rejects 5-digit pincode', () => {
    expect(validatePincode('60000').success).toBe(false);
  });

  it('rejects non-numeric pincode', () => {
    expect(validatePincode('ABCDEF').success).toBe(false);
  });
});
