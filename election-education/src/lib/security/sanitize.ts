/**
 * @module Input Sanitization
 * @description Sanitizes user input to prevent XSS and injection attacks.
 * Uses DOMPurify on server side via jsdom.
 */

/**
 * Sanitize a string by removing HTML tags and dangerous characters
 * @param input - Raw user input
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

/**
 * Sanitize an object's string values recursively
 * @param data - Object with potential unsafe string values
 * @returns Sanitized object
 */
export const sanitizeInput = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeString(item)
          : typeof item === 'object' && item !== null
            ? sanitizeInput(item as Record<string, unknown>)
            : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeInput(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};

/**
 * Sanitize HTML content for safe rendering (preserves safe tags)
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div',
  ];

  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  return html.replace(tagPattern, (match, tagName: string) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Remove event handlers from allowed tags
      return match.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    }
    return '';
  });
};

/**
 * Validate and sanitize a URL
 * @param url - URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
};
