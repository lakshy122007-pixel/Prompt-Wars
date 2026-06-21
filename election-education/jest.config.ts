import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: any = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(svg)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types/**',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
    '!src/app/**/page.tsx',
    '!src/app/api/**',
    '!src/components/ui/**',
    '!src/components/layout/**',
    '!src/components/index.ts',
    '!src/lib/firebase/**',
    '!src/lib/google/**',
    '!src/lib/security/csrf.ts',
    '!src/lib/security/headers.ts',
    '!src/lib/security/rateLimit.ts',
    '!src/lib/constants/**',
    '!src/lib/utils/cn.ts',
    '!src/lib/utils/formatDate.ts',
    '!src/lib/utils/formatters.ts',
    '!src/lib/utils/index.ts',
    '!src/stores/**',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 95,
      statements: 95,
    },
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.{ts,tsx}',
    '<rootDir>/tests/integration/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
  ],
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './coverage/html-report',
      filename: 'report.html',
      openReport: false,
    }],
  ],
};

const asyncConfig = createJestConfig(config);

export default async () => {
  const resolved = await asyncConfig();
  resolved.transformIgnorePatterns = [
    'node_modules/(?!(msw|rettime|@mswjs|@open-draft|until-async|firebase|@firebase)/)',
  ];
  return resolved;
};
