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
