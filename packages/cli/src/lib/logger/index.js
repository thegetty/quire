import chalk from 'chalk'
import log from 'loglevel'

/**
 * Logger factory for Quire CLI
 *
 * Creates loggers with colored output, log level filtering, and module prefixes.
 * Aligns with the 11ty package logging format for consistent user experience.
 *
 * @example
 * // Module-specific logger
 * import createLogger from '#lib/logger/index.js'
 * const logger = createLogger('lib:pdf')
 * logger.info('Generating PDF...')
 * // Output: [quire] INFO  lib:pdf                   Generating PDF...
 *
 * @example
 * // Default singleton for simple usage
 * import { logger } from '#lib/logger/index.js'
 * logger.info('Starting build...')
 *
 * @example
 * // In tests - mock the factory
 * const mockLogger = {
 *   info: sandbox.stub(),
 *   error: sandbox.stub(),
 *   debug: sandbox.stub(),
 *   warn: sandbox.stub(),
 *   trace: sandbox.stub()
 * }
 * const module = await esmock('./module.js', {
 *   '#lib/logger/index.js': { default: () => mockLogger, logger: mockLogger }
 * })
 */

/**
 * Log level constants matching loglevel library
 * @see https://github.com/pimterry/loglevel#documentation
 */
export const LOG_LEVELS = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  silent: 5
}

/**
 * Chalk styles for each log level
 * Matches 11ty package styling for consistency
 */
const styles = {
  trace: chalk.gray,
  debug: chalk.yellow,
  info: chalk.magenta,
  warn: chalk.yellow.inverse,
  error: chalk.redBright.inverse
}

/**
 * Environment variable for log level configuration
 * Set by CLI startup from config, can be overridden by CLI flags
 */
export const LOG_LEVEL_ENV_VAR = 'QUIRE_LOG_LEVEL'

/**
 * Resolve log level from various sources
 *
 * Priority order:
 * 1. Explicit level parameter (for createLogger calls with specific level)
 * 2. QUIRE_LOG_LEVEL environment variable (set by CLI from config/flags)
 * 3. Default to 'info'
 *
 * @param {string|number} [level] - Explicit level override
 * @returns {number} Numeric log level
 */
function resolveLevel(level) {
  // If level is explicitly provided, use it
  if (level !== undefined) {
    if (typeof level === 'number') return level
    return LOG_LEVELS[level] ?? LOG_LEVELS.info
  }

  // Check environment variable (set by CLI startup from config)
  const envVar = process.env[LOG_LEVEL_ENV_VAR]
  if (envVar) {
    return LOG_LEVELS[envVar] ?? LOG_LEVELS.info
  }

  // Default to info
  return LOG_LEVELS.info
}

/**
 * Create a logger instance with the given prefix
 *
 * @param {string} [prefix='cli'] - Module prefix for log messages
 * @param {string|number} [level] - Log level (trace, debug, info, warn, error, silent)
 * @returns {Object} Logger instance with trace, debug, info, warn, error, setLevel methods
 */
export default function createLogger(prefix = 'quire', level) {
  const loggerInstance = log.getLogger(prefix)
  loggerInstance.setLevel(resolveLevel(level), false)

  // Pad prefix to 25 characters for alignment (matches 11ty format)
  const paddedPrefix = prefix.padEnd(25, ' ')

  /**
   * Create a log function for a specific level
   */
  const createLogFn = (type) => {
    const logMethod = loggerInstance[type]
    const style = styles[type]

    return (...args) => {
      // Format: [quire] LEVEL prefix                    message
      const levelLabel = type.toUpperCase().padEnd(5, ' ')
      const styledLabel = style(chalk.bold(`[quire] ${levelLabel}`))
      logMethod(styledLabel, paddedPrefix, ...args)
    }
  }

  return {
    trace: createLogFn('trace'),
    debug: createLogFn('debug'),
    info: createLogFn('info'),
    warn: createLogFn('warn'),
    error: createLogFn('error'),

    /**
     * Change the log level at runtime
     * @param {string|number} newLevel - New log level
     */
    setLevel(newLevel) {
      const numericLevel = typeof newLevel === 'number'
        ? newLevel
        : LOG_LEVELS[newLevel] ?? LOG_LEVELS.info
      loggerInstance.setLevel(numericLevel, false)
    },

    /**
     * Get the current log level
     * @returns {number} Current numeric log level
     */
    getLevel() {
      return loggerInstance.getLevel()
    }
  }
}

/**
 * Default singleton logger for simple usage
 * Use createLogger() for module-specific prefixes
 */
export const logger = createLogger('quire')
