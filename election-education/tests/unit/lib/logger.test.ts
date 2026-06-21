// tests/unit/lib/logger.test.ts
import { logger } from '@/lib/utils/logger';

describe('Application Logger', () => {
  let debugSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  const originalEnv = process.env.NODE_ENV;

  const setNodeEnv = (val: string | undefined) => {
    const env = process.env as any;
    if (val === undefined) {
      delete env.NODE_ENV;
    } else {
      env.NODE_ENV = val;
    }
  };

  beforeEach(() => {
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    setNodeEnv(originalEnv);
  });

  describe('debug', () => {
    it('logs debug in development environment', () => {
      setNodeEnv('development');
      logger.debug('debug message', { key: 'val' });
      expect(debugSpy).toHaveBeenCalled();
      expect(debugSpy.mock.calls[0][0]).toContain('[DEBUG] debug message {"key":"val"}');
    });

    it('does not log debug in non-development environments', () => {
      setNodeEnv('production');
      logger.debug('should not show');
      expect(debugSpy).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('logs info in development environment', () => {
      setNodeEnv('development');
      logger.info('info message', { status: 'ok' });
      expect(infoSpy).toHaveBeenCalled();
      expect(infoSpy.mock.calls[0][0]).toContain('[INFO] info message {"status":"ok"}');
    });

    it('does not write to console.info in non-development environment', () => {
      setNodeEnv('production');
      logger.info('info log');
      expect(infoSpy).not.toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('logs warning with context', () => {
      logger.warn('warning message', { detail: 'something' });
      expect(warnSpy).toHaveBeenCalled();
      expect(warnSpy.mock.calls[0][0]).toContain('[WARN] warning message {"detail":"something"}');
    });
  });

  describe('error', () => {
    it('logs error message without context', () => {
      logger.error('error message');
      expect(errorSpy).toHaveBeenCalled();
      expect(errorSpy.mock.calls[0][0]).toContain('[ERROR] error message');
    });
  });
});
