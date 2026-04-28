// tests/integration/api/assistant.test.ts
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/assistant/route';
import { verifyAuthToken } from '@/lib/firebase/auth';
import { rateLimit } from '@/lib/security/rateLimit';

jest.mock('@/lib/firebase/auth');
jest.mock('@/lib/security/rateLimit');
jest.mock('@/lib/google/gemini');

const mockVerifyAuthToken = verifyAuthToken as jest.MockedFunction<typeof verifyAuthToken>;
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;

describe('POST /api/assistant', () => {
  beforeEach(() => {
    mockRateLimit.mockResolvedValue({ success: true, remaining: 19, retryAfter: 0 });
    mockVerifyAuthToken.mockResolvedValue({ uid: 'user123', email: 'test@example.com' });
  });

  it('returns 401 when not authenticated', async () => {
    mockVerifyAuthToken.mockResolvedValueOnce(null);
    const request = new Request('http://localhost/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(401);
  });

  it('returns 429 when rate limit exceeded', async () => {
    mockRateLimit.mockResolvedValueOnce({ success: false, remaining: 0, retryAfter: 3600 });
    const request = new Request('http://localhost/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'Test' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(429);
  });

  it('returns 400 for invalid request body', async () => {
    const request = new Request('http://localhost/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ invalidField: 'bad data' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('returns 400 for empty message', async () => {
    const request = new Request('http://localhost/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('returns 200 with AI response for valid request', async () => {
    const { generateChatResponse } = require('@/lib/google/gemini');
    generateChatResponse.mockResolvedValueOnce('Here is info about voting.');
    
    const request = new Request('http://localhost/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'How do I vote?', conversationHistory: [] }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.content).toBe('Here is info about voting.');
  });

  it('returns 500 on Gemini API failure', async () => {
    const { generateChatResponse } = require('@/lib/google/gemini');
    generateChatResponse.mockRejectedValueOnce(new Error('Gemini API down'));
    
    const request = new Request('http://localhost/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'Test', conversationHistory: [] }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
  });

  it('sanitizes message before processing', async () => {
    const { generateChatResponse } = require('@/lib/google/gemini');
    generateChatResponse.mockResolvedValueOnce('Safe response');
    
    const request = new Request('http://localhost/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: '<script>alert(1)</script>How to vote?', conversationHistory: [] }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    const response = await POST(request as any);
    expect(response.status).toBe(200);
    const callArgs = generateChatResponse.mock.calls[0][0];
    expect(callArgs).not.toContain('<script>');
  });
});
