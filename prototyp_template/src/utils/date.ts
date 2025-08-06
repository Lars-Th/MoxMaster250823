import { DateTime, Duration } from 'luxon';

/**
 * Date utilities using Luxon for consistent date handling
 * Replaces manual Date calculations and provides timezone support
 */

// Swedish locale for date formatting
const SWEDISH_LOCALE = 'sv-SE';
const SWEDISH_TIMEZONE = 'Europe/Stockholm';

/**
 * Format date to Swedish locale
 */
export function formatDate(date: string | Date | DateTime, format: string = 'yyyy-MM-dd'): string {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;

  return dt.setLocale(SWEDISH_LOCALE).toFormat(format);
}

/**
 * Format time to Swedish locale
 */
export function formatTime(date: string | Date | DateTime, format: string = 'HH:mm'): string {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;

  return dt.setLocale(SWEDISH_LOCALE).toFormat(format);
}

/**
 * Format date and time to Swedish locale
 */
export function formatDateTime(
  date: string | Date | DateTime,
  format: string = 'yyyy-MM-dd HH:mm'
): string {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;

  return dt.setLocale(SWEDISH_LOCALE).toFormat(format);
}

/**
 * Calculate duration between two dates in hours
 */
export function calculateDurationHours(
  startDate: string | Date | DateTime,
  endDate: string | Date | DateTime
): number {
  const start =
    typeof startDate === 'string'
      ? DateTime.fromISO(startDate)
      : startDate instanceof Date
        ? DateTime.fromJSDate(startDate)
        : startDate;
  const end =
    typeof endDate === 'string'
      ? DateTime.fromISO(endDate)
      : endDate instanceof Date
        ? DateTime.fromJSDate(endDate)
        : endDate;

  const duration = end.diff(start);
  return Math.round(duration.as('hours') * 100) / 100;
}

/**
 * Calculate duration between two dates in days
 */
export function calculateDurationDays(
  startDate: string | Date | DateTime,
  endDate: string | Date | DateTime
): number {
  const start =
    typeof startDate === 'string'
      ? DateTime.fromISO(startDate)
      : startDate instanceof Date
        ? DateTime.fromJSDate(startDate)
        : startDate;
  const end =
    typeof endDate === 'string'
      ? DateTime.fromISO(endDate)
      : endDate instanceof Date
        ? DateTime.fromJSDate(endDate)
        : endDate;

  return Math.ceil(end.diff(start, 'days').days);
}

/**
 * Add days to a date
 */
export function addDays(date: string | Date | DateTime, days: number): DateTime {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;

  return dt.plus({ days });
}

/**
 * Set time on a date
 */
export function setTime(
  date: string | Date | DateTime,
  hour: number,
  minute: number = 0,
  second: number = 0
): DateTime {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;

  return dt.set({ hour, minute, second, millisecond: 0 });
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: string | Date | DateTime): boolean {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;
  const now = DateTime.now();

  return dt > now;
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date | DateTime): boolean {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;
  const today = DateTime.now();

  return dt.hasSame(today, 'day');
}

/**
 * Get start of day
 */
export function startOfDay(date: string | Date | DateTime): DateTime {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;

  return dt.startOf('day');
}

/**
 * Get end of day
 */
export function endOfDay(date: string | Date | DateTime): DateTime {
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date)
      : date instanceof Date
        ? DateTime.fromJSDate(date)
        : date;

  return dt.endOf('day');
}

/**
 * Parse date string with fallback
 */
export function parseDate(dateString: string, fallback?: DateTime): DateTime | null {
  const dt = DateTime.fromISO(dateString);
  if (dt.isValid) {
    return dt;
  }
  return fallback ?? null;
}

/**
 * Format duration in hours and minutes
 */
export function formatDuration(durationMs: number): string {
  const duration = Duration.fromMillis(durationMs);
  const hours = Math.floor(duration.as('hours'));
  const minutes = Math.floor(duration.as('minutes') % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Get current date in Swedish timezone
 */
export function now(): DateTime {
  return DateTime.now().setZone(SWEDISH_TIMEZONE);
}

/**
 * Create date from components
 */
export function createDate(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0
): DateTime {
  return DateTime.fromObject({ year, month, day, hour, minute }, { zone: SWEDISH_TIMEZONE });
}

/**
 * Validate date string
 */
export function isValidDate(dateString: string): boolean {
  const dt = DateTime.fromISO(dateString);
  return dt.isValid;
}
