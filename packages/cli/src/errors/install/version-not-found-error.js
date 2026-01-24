import path from 'node:path'
import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a package version cannot be determined
 *
 * Handles both npm registry lookups and local package paths.
 */
export default class VersionNotFoundError extends QuireError {
  /**
   * @param {string} packageName - Package name or path description
   * @param {string} reason - Version string for npm, or reason for local path
   * @param {Object} [options] - Override default suggestion
   * @param {string} [options.suggestion] - Custom suggestion text
   */
  constructor(packageName, reason, options = {}) {
    const isLocalPath = packageName.includes(path.sep)
    const defaultSuggestion = isLocalPath
      ? 'Ensure the local package has a valid package.json with a version field'
      : `Run 'npm view ${packageName} versions' to see available versions`

    super(
      isLocalPath
        ? `Cannot determine version from ${packageName}: ${reason}`
        : `Version '${reason}' of ${packageName} not found`,
      {
        code: 'VERSION_NOT_FOUND',
        exitCode: 6,
        suggestion: options.suggestion || defaultSuggestion,
        docsUrl: docsUrl('install-uninstall')
      }
    )
  }
}
