/**
 * Centralized error handler for the Quire CLI
 *
 * Provides consistent error formatting and exit code management.
 * All command errors should flow through this handler.
 *
 * @module lib/error/handler
 */
import { logger } from '#lib/logger/index.js'
import QuireError from '#src/errors/quire-error.js'

/**
 * Format a QuireError for user display
 *
 * @param {QuireError} error - The error to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.debug - Include error code in output (default: false)
 * @returns {string} Formatted error message
 */
export function formatError(error, options = {}) {
  const { debug = false } = options
  // Only show error code (e.g., INVALID_PATH) in debug mode
  const header = (debug && error.code) ? `${error.code} ${error.message}` : error.message
  const lines = [header]
  if (error.filePath) lines.push(`  File: ${error.filePath}`)
  if (error.suggestion) lines.push(`  Suggestion: ${error.suggestion}`)
  if (error.docsUrl) lines.push(`  Learn more: ${error.docsUrl}`)
  // Show debug hint when not in debug mode and error opts in
  if (!debug && error.showDebugHint !== false) {
    lines.push('  Tip: Run with --debug for more details')
  }
  return lines.join('\n')
}

/**
 * Handle a single error
 *
 * @param {Error} error - The error to handle
 * @param {Object} options
 * @param {boolean} options.exit - Whether to exit process (default: true)
 * @param {Function} options.exitFn - Exit function for testing (default: process.exit)
 * @param {boolean} options.debug - Show stack traces (default: false)
 * @returns {number} Exit code
 */
export function handleError(error, options = {}) {
  const { exit = true, exitFn = process.exit, debug = false } = options

  if (error instanceof QuireError) {
    logger.error(formatError(error, { debug }))

    if (debug && error.stack) {
      logger.debug('Stack trace:')
      logger.debug(error.stack)
    }

    if (exit) exitFn(error.exitCode)
    return error.exitCode
  }

  // Non-Quire errors (unexpected)
  logger.error(`Unexpected error: ${error.message}`)
  logger.info('Please report this issue: https://github.com/thegetty/quire/issues')

  if (debug && error.stack) {
    logger.debug('Stack trace:')
    logger.debug(error.stack)
  }

  if (exit) exitFn(1)
  return 1
}

/**
 * Handle multiple errors (for batch validation)
 *
 * @param {Error[]} errors - Array of errors
 * @param {Object} options - Same as handleError
 * @returns {number} Highest exit code
 */
export function handleErrors(errors, options = {}) {
  if (!errors.length) return 0

  const { exit = true, exitFn = process.exit, debug = false } = options

  logger.error(`${errors.length} error(s) occurred:\n`)

  let maxExitCode = 1
  errors.forEach((error, i) => {
    const formatted = error instanceof QuireError ? formatError(error, { debug }) : error.message
    logger.error(`${i + 1}. ${formatted}`)
    if (error instanceof QuireError && error.exitCode > maxExitCode) {
      maxExitCode = error.exitCode
    }
  })

  if (debug) {
    errors.forEach((error) => {
      if (error.stack) {
        logger.debug(`Stack trace for ${error.message}:`)
        logger.debug(error.stack)
      }
    })
  }

  if (exit) exitFn(maxExitCode)
  return maxExitCode
}
