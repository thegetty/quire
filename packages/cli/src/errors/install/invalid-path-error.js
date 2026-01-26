import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a specified path does not exist
 *
 * Used when --quire-path option points to a non-existent directory.
 */
export default class InvalidPathError extends QuireError {
  /**
   * @param {string} originalPath - The path as provided by the user
   * @param {string} resolvedPath - The fully resolved absolute path
   */
  constructor(originalPath, resolvedPath) {
    const pathDisplay = originalPath === resolvedPath
      ? originalPath
      : `${originalPath} (resolved to: ${resolvedPath})`

    super(
      `--quire-path does not exist: ${pathDisplay}`,
      {
        code: 'INVALID_PATH',
        exitCode: 6,
        filePath: resolvedPath,
        suggestion: 'Verify the path exists and is accessible',
        docsUrl: docsUrl('install-uninstall'),
        showDebugHint: false
      }
    )
  }
}
