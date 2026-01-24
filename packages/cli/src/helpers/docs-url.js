/**
 * Helper module for constructing documentation URLs
 * @module helpers/docs-url
 */

/**
 * Base URL for Quire documentation
 */
const DOCS_BASE = 'https://quire.getty.edu/docs-v1/'

/**
 * Export the base URL for cases where direct access is needed
 */
export { DOCS_BASE }

/**
 * Construct a full documentation URL from a path segment
 *
 * Uses the URL constructor for automatic path normalization.
 *
 * @param {string} path - Documentation path segment (e.g., 'install-uninstall')
 * @returns {string} Full documentation URL
 *
 * @example
 * docsUrl('install-uninstall')
 * // => 'https://quire.getty.edu/docs-v1/install-uninstall'
 *
 * @example
 * docsUrl('troubleshooting/')
 * // => 'https://quire.getty.edu/docs-v1/troubleshooting/'
 */
export function docsUrl(path) {
  return new URL(path, DOCS_BASE).href
}
