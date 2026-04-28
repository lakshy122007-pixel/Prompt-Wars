// tests/integration/api/translate.test.ts
import { POST } from '@/app/api/translate/route';
import { verifyAuthToken } from '@/lib/firebase/auth';
import { rateLimit } from '@/lib/security/rateLimit';

jest.mock('@/lib/firebase/auth');
jest.mock('@/lib/security/rateLimit');
jest.mock('@/lib/google/translate');

const mockVerifyAuthToken = verifyAuthToken as jest.MockedFunction<typeof verifyAuthToken>;
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;

describe('POST /api/translate', () => {
  beforeEach(() => {
    mockRateLimit.mockResolvedValue({ success: true, remaining: 99, retryAfter: 0 });
    mockVerifyAuthToken.mockResolvedValue({ uid: 'user123', email: 'test@example.com' });
  });

  it('returns original text for English target language', async () => {
    const request = new Request('http://localhost/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello World', targetLanguage: 'en' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    const data = await response.json();
    expect(data.data.translatedText).toBe('Hello World');
    expect(response.status).toBe(200);
  });

  it('validates text length limit', async () => {
    const request = new Request('http://localhost/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: 'a'.repeat(10001), targetLanguage: 'hi' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('validates supported language codes', async () => {
    const request = new Request('http://localhost/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello', targetLanguage: 'xx' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });
});
