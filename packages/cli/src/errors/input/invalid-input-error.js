import QuireError from '../quire-error.js'

/**
 * Error thrown when user input is invalid
 *
 * Generic error for invalid arguments, options, or other user-provided values.
 * Can be extended for specific input validation scenarios.
 */
export default class InvalidInputError extends QuireError {
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'INVALID_INPUT',
      exitCode: options.exitCode ?? 2,
      suggestion: options.suggestion,
      docsUrl: options.docsUrl,
      ...options
    })
    this.inputValue = options.inputValue
    this.inputName = options.inputName
  }
}
