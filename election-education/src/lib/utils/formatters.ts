/**
 * @module Formatters
 * @description General formatting utilities for the application.
 */

/**
 * Format a number with commas (Indian numbering system)
 * @param num - Number to format
 * @returns Formatted number string (e.g., "12,34,567")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format a percentage value
 * @param value - The numerator
 * @param total - The denominator
 * @returns Formatted percentage string (e.g., "85.5%")
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 1000) / 10}%`;
};

/**
 * Format time in minutes to a human-readable string
 * @param minutes - Total minutes
 * @returns Formatted time string (e.g., "1h 30m")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 1) return 'Less than a minute';
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format a score for display
 * @param score - Points scored
 * @param total - Total possible points
 * @returns Formatted score string
 */
export const formatScore = (score: number, total: number): string => {
  return `${score}/${total}`;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};

/**
 * Generate initials from a display name
 * @param name - Full name
 * @returns 1-2 character initials
 */
export const getInitials = (name: string | null): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
