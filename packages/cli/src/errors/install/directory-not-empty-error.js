import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when attempting to create a project in a non-empty directory
 *
 * This error indicates the target directory contains existing files,
 * which could be user content that should not be overwritten or deleted.
 */
export default class DirectoryNotEmptyError extends QuireError {
  constructor(path) {
    const location = path === '.' ? 'the current directory' : path
    super(
      `Cannot create project in a non-empty directory: ${location}`,
      {
        code: 'DIRECTORY_NOT_EMPTY',
        exitCode: 2,
        filePath: path,
        suggestion: 'Choose an empty directory or create a new one',
        docsUrl: docsUrl('install-uninstall')
      }
    )
  }
}
