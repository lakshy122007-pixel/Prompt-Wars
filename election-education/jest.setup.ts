// jest.setup.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { server } from './tests/__mocks__/server';

// Polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock Firebase
jest.mock('@/lib/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((cb) => { cb(null); return jest.fn(); }),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  },
  db: {
    collection: jest.fn(),
  },
  analytics: null,
}));

// Mock Gemini
jest.mock('@/lib/google/gemini', () => ({
  generateChatResponse: jest.fn(),
  streamChatResponse: jest.fn(),
}));

// MSW server for API mocking
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
