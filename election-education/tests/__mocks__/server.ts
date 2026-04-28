// tests/__mocks__/server.ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Gemini AI endpoint
  http.post('/api/assistant', async ({ request }) => {
    const body = await request.json() as { message: string };
    return HttpResponse.json({
      data: {
        id: 'msg_mock_001',
        role: 'assistant',
        content: `Mock response for: ${body.message}`,
        timestamp: new Date().toISOString(),
      },
    });
  }),

  // Mock translate endpoint
  http.post('/api/translate', async ({ request }) => {
    const body = await request.json() as { text: string; targetLanguage: string };
    return HttpResponse.json({
      data: {
        translatedText: `[${body.targetLanguage}] ${body.text}`,
        sourceLanguage: 'en',
        targetLanguage: body.targetLanguage,
      },
    });
  }),

  // Mock polling stations endpoint
  http.get('/api/polling-stations', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
    return HttpResponse.json({
      data: [
        {
          id: 'station_001',
          name: 'Government Primary School',
          address: '123 Main Street, Chennai',
          lat: parseFloat(lat ?? '13.08'),
          lng: parseFloat(lng ?? '80.27'),
          boothNumber: 'TN-001',
          isAccessible: true,
          distance: 0.5,
        },
        {
          id: 'station_002',
          name: 'Municipal Community Hall',
          address: '456 Gandhi Road, Chennai',
          lat: parseFloat(lat ?? '13.08') + 0.01,
          lng: parseFloat(lng ?? '80.27') + 0.01,
          boothNumber: 'TN-002',
          isAccessible: false,
          distance: 1.2,
        },
      ],
    });
  }),

  // Mock voter check endpoint
  http.post('/api/voter-check', () => {
    return HttpResponse.json({
      data: {
        isEligible: true,
        reason: 'Meets all eligibility criteria',
        details: {
          ageEligible: true,
          citizenshipEligible: true,
          registrationRequired: true,
        },
      },
    });
  }),

  // Mock quiz endpoint
  http.get('/api/quiz', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'q001',
          category: 'voter-eligibility',
          difficulty: 'easy',
          question: 'What is the minimum age to vote in India?',
          options: ['16', '18', '21', '25'],
          correctAnswer: 1,
          explanation: 'Article 326 sets minimum voting age at 18.',
          points: 10,
          timeLimit: 30,
        },
      ],
    });
  }),

  // Mock news endpoint
  http.get('/api/news', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'news_001',
          title: 'Election Commission Announces Schedule',
          description: 'ECI releases comprehensive election schedule.',
          url: 'https://example.com/news/1',
          publishedAt: new Date().toISOString(),
          source: 'ECI Official',
        },
      ],
    });
  }),

  // Mock TTS endpoint
  http.post('/api/tts', () => {
    return new HttpResponse(new ArrayBuffer(1024), {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  }),
];

export const server = setupServer(...handlers);
