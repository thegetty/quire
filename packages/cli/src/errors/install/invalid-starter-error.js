import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a starter template path does not exist
 *
 * Used when the starter argument points to a non-existent local directory.
 */
export default class InvalidStarterError extends QuireError {
  /**
   * @param {string} starterPath - The starter path that doesn't exist
   */
  constructor(starterPath) {
    super(
      `Starter template not found: ${starterPath}`,
      {
        code: 'INVALID_STARTER',
        exitCode: 6,
        filePath: starterPath,
        suggestion: 'Verify the path exists or use a repository URL',
        docsUrl: docsUrl('install-uninstall')
      }
    )
  }
}
