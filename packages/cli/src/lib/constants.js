/**
 * Shared CLI constants
 *
 * Centralized constants used across the CLI to avoid duplication
 * and ensure consistency.
 *
 * @module lib/constants
 */

/**
 * Base URL for Quire documentation (without trailing slash)
 *
 * Use with URL constructor for path joining:
 * @example
 * new URL('install-uninstall/', DOCS_BASE_URL).href
 * // => 'https://quire.getty.edu/docs-v1/install-uninstall/'
 */
export const DOCS_BASE_URL = 'https://quire.getty.edu/docs-v1'

/**
 * Package name for quire-11ty
 */
export const QUIRE_11TY_PACKAGE = '@thegetty/quire-11ty'

/**
 * Minimum required Node.js major version
 */
export const REQUIRED_NODE_VERSION = 22
