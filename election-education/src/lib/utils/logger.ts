/**
 * @module Application Logger
 * @description Structured logging utility replacing raw console statements.
 * Outputs structured entries in development; integrates with monitoring in production.
 *
 * @example
 * logger.info('User signed in', { method: 'google' });
 * logger.error('API call failed', { endpoint: '/api/assistant', statusCode: 500 });
 */

/** Severity levels for log entries */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Structured log entry */
interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly context?: Record<string, unknown>;
}

/**
 * Formats a log entry into a readable string
 * @param entry - The log entry to format
 * @returns Formatted log string
 */
const formatEntry = (entry: LogEntry): string => {
  const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${ctx}`;
};

/**
 * Creates a structured log entry
 * @param level - Severity level
 * @param message - Log message
 * @param context - Optional structured context (never include PII)
 * @returns Structured log entry
 */
const createEntry = (
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): LogEntry => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  context,
});

/**
 * Application logger — structured logging with no PII.
 * Uses console in development, can be wired to external monitoring in production.
 */
export const logger = {
  /** Debug level — stripped in production */
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'development') return;
    const entry = createEntry('debug', message, context);
    // eslint-disable-next-line no-console
    console.debug(formatEntry(entry));
  },

  /** Info level — general operational events */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = createEntry('info', message, context);
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info(formatEntry(entry));
    }
  },

  /** Warn level — unexpected but recoverable situations */
  warn(message: string, context?: Record<string, unknown>): void {
    const entry = createEntry('warn', message, context);
    // eslint-disable-next-line no-console
    console.warn(formatEntry(entry));
  },

  /** Error level — failures requiring attention */
  error(message: string, context?: Record<string, unknown>): void {
    const entry = createEntry('error', message, context);
    // eslint-disable-next-line no-console
    console.error(formatEntry(entry));
  },
} as const;
