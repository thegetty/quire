/**
 * Duration formatting utilities for doctor module
 *
 * Provides human-readable time duration formatting for diagnostic checks,
 * particularly useful for displaying how stale a build output is compared
 * to source files.
 *
 * @module lib/doctor/formatDuration
 */

/**
 * Time unit definitions in milliseconds
 * @constant {Object}
 */
const TIME_UNITS = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
}

/**
 * Format a duration in milliseconds as a human-readable string.
 *
 * Converts a time duration to the most appropriate unit (seconds through years),
 * using singular or plural form as needed. The function selects the largest
 * applicable unit to keep output concise.
 *
 * @param {number} ms - Duration in milliseconds. Must be a non-negative number.
 *
 * @returns {string} Human-readable duration string with unit.
 *
 * @example
 * // Returns "45 seconds"
 * formatDuration(45000)
 *
 * @example
 * // Returns "1 hour"
 * formatDuration(3600000)
 *
 * @example
 * // Returns "2 weeks"
 * formatDuration(14 * 24 * 60 * 60 * 1000)
 *
 * @example
 * // Returns "3 months"
 * formatDuration(90 * 24 * 60 * 60 * 1000)
 *
 * @example
 * // Returns "1 year"
 * formatDuration(365 * 24 * 60 * 60 * 1000)
 *
 * @remarks
 * - Uses approximate values for months (30 days) and years (365 days)
 * - Always returns the largest applicable unit (e.g., "2 weeks" not "14 days")
 * - Handles singular/plural forms automatically
 * - Returns "0 seconds" for zero or negative input
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / TIME_UNITS.second)
  const minutes = Math.floor(ms / TIME_UNITS.minute)
  const hours = Math.floor(ms / TIME_UNITS.hour)
  const days = Math.floor(ms / TIME_UNITS.day)
  const weeks = Math.floor(ms / TIME_UNITS.week)
  const months = Math.floor(ms / TIME_UNITS.month)
  const years = Math.floor(ms / TIME_UNITS.year)

  if (years > 0) {
    return `${years} year${years === 1 ? '' : 's'}`
  }
  if (months > 0) {
    return `${months} month${months === 1 ? '' : 's'}`
  }
  if (weeks > 0) {
    return `${weeks} week${weeks === 1 ? '' : 's'}`
  }
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'}`
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`
  }
  return `${seconds} second${seconds === 1 ? '' : 's'}`
}

export default formatDuration
