// tests/unit/lib/sanitize.test.ts
import { sanitizeInput, sanitizeHtml, sanitizeUrl } from '@/lib/security/sanitize';

describe('sanitizeInput', () => {
  it('removes script tags from strings', () => {
    const malicious = '<script>alert("xss")</script>Hello';
    expect(sanitizeInput({ text: malicious }).text).not.toContain('<script>');
  });

  it('removes javascript: protocol from URLs', () => {
    const malicious = 'javascript:alert(1)';
    expect(sanitizeUrl(malicious)).toBe('');
  });

  it('preserves safe HTML content', () => {
    const safe = '<p>Hello <strong>World</strong></p>';
    expect(sanitizeHtml(safe)).toContain('<p>');
    expect(sanitizeHtml(safe)).toContain('<strong>');
  });

  it('removes dangerous attributes', () => {
    const malicious = '<p onclick="evil()">Text</p>';
    expect(sanitizeHtml(malicious)).not.toContain('onclick');
  });

  it('handles null and undefined gracefully', () => {
    expect(() => sanitizeInput(null as unknown as object)).not.toThrow();
    expect(() => sanitizeInput(undefined as unknown as object)).not.toThrow();
  });

  it('strips nested script injection attempts', () => {
    const obfuscated = '<scr<script>ipt>alert(1)</scr</script>ipt>';
    expect(sanitizeHtml(obfuscated)).not.toContain('alert');
  });

  it('preserves numbers and safe characters', () => {
    const safe = { age: 25, name: 'Lakshmi Priya', pincode: '600001' };
    const result = sanitizeInput(safe);
    expect(result.age).toBe(25);
    expect(result.name).toBe('Lakshmi Priya');
  });
});
