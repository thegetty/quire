/**
 * Logger service for Quire CLI
 *
 * Provides a simple abstraction over console methods to make
 * commands easier to test by using a mock for this logger
 * via esmock to capture and assert on log output without
 * stubbing global console methods.
 *
 * @example
 * // In production code
 * import logger from '#src/lib/logger.js'
 * logger.info('Starting build...')
 * logger.error('Build failed:', error)
 *
 * @example
 * // In tests
 * const mockLogger = {
 *   info: sandbox.stub(),
 *   error: sandbox.stub()
 * }
 * const MyCommand = await esmock('./mycommand.js', {
 *   '#src/lib/logger.js': { default: mockLogger }
 * })
 */
class Logger {
  /**
   * Log informational messages
   * @param {...any} args - Arguments to log
   */
  info(...args) {
    console.info(...args)
  }

  /**
   * Log error messages
   * @param {...any} args - Arguments to log
   */
  error(...args) {
    console.error(...args)
  }

  /**
   * Log debug messages
   * @param {...any} args - Arguments to log
   */
  debug(...args) {
    console.debug(...args)
  }

  /**
   * Log general messages
   * @param {...any} args - Arguments to log
   */
  log(...args) {
    console.log(...args)
  }

  /**
   * Log warning messages
   * @param {...any} args - Arguments to log
   */
  warn(...args) {
    console.warn(...args)
  }
}

// Export singleton instance
export default new Logger()
