import { DOCS_BASE } from '#helpers/docs-url.js'

/**
 * Base error class for all Quire CLI errors
 *
 * Provides structured error data for the error handler to format.
 *
 * @property {string} code - Error code (e.g., 'CONFIG_FILE_NOT_FOUND')
 * @property {number} exitCode - Process exit code (default: 1)
 * @property {string} suggestion - Actionable fix for the user
 * @property {string} docsUrl - Link to relevant documentation
 * @property {string} filePath - Source file that caused the error (optional)
 */
export default class QuireError extends Error {
  /**
   * @deprecated Use `import { DOCS_BASE } from '#helpers/docs-url.js'` instead
   */
  static DOCS_BASE = DOCS_BASE

  constructor(message, options = {}) {
    super(message)
    this.name = this.constructor.name
    this.code = options.code
    this.exitCode = options.exitCode ?? 1
    this.suggestion = options.suggestion
    this.docsUrl = options.docsUrl
    this.filePath = options.filePath
    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
