import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a starter template is invalid
 *
 * Used when the starter argument points to a non-existent path
 * or a path that is not a valid git repository.
 */
export default class InvalidStarterError extends QuireError {
  /**
   * @param {string} starterPath - The starter path that is invalid
   * @param {string} reason - Why the starter is invalid
   */
  constructor(starterPath, reason) {
    super(
      `Invalid starter template '${starterPath}': ${reason}`,
      {
        code: 'INVALID_STARTER',
        exitCode: 6,
        filePath: starterPath,
        suggestion: 'Verify the path exists and is a git repository, or use a repository URL',
        docsUrl: docsUrl('install-uninstall')
      }
    )
  }
}
