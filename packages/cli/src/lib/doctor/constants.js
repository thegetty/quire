/**
 * Re-export shared constants for doctor checks
 *
 * This module re-exports constants from the shared lib/constants.js
 * to maintain backwards compatibility with existing doctor check imports.
 *
 * @module lib/doctor/constants
 */
export {
  DOCS_BASE_URL,
  QUIRE_11TY_PACKAGE,
  REQUIRED_NODE_VERSION,
} from '#lib/constants.js'

/**
 * Stale threshold intervals in milliseconds, keyed by setting name.
 *
 * Used by output checks (stale-build, pdf-output, epub-output) to determine
 * how much time must elapse before an output is flagged as stale.
 *
 * @constant {Object<string, number>}
 */
export const STALE_THRESHOLDS = Object.freeze({
  ZERO: 0,
  SHORT: 5 * 60 * 1000,
  HOURLY: 60 * 60 * 1000,
  DAILY: 12 * 60 * 60 * 1000,
  NEVER: Infinity,
})

/**
 * Resolve the staleThreshold config value to milliseconds.
 *
 * @param {string} value - One of the STALE_THRESHOLDS keys
 * @returns {number} Threshold in milliseconds
 */
export function resolveStaleThreshold(value) {
  return STALE_THRESHOLDS[value] ?? STALE_THRESHOLDS.HOURLY
}
