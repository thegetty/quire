import { format } from 'node:util'
import chalk from 'chalk'
import log from 'loglevel'
import config from '#lib/conf/config.js'

/**
 * Logger factory for Quire CLI
 *
 * Creates loggers with colored output, log level filtering, and configurable prefixes.
 * Configuration is read from the conf module for prefix style, colors, etc.
 *
 * @example
 * // Default singleton for simple usage
 * import { logger } from '#lib/logger/index.js'
 * logger.info('Building site...')
 * // Output: [quire] INFO  Building site...
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
 *   '#lib/logger/index.js': { logger: mockLogger }
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
 * Chalk style functions for prefix and level label
 */
const lableStyleFns = {
  trace: chalk.gray,
  debug: chalk.yellow,
  info: chalk.magenta,
  warn: chalk.yellow.inverse,
  error: chalk.redBright.inverse
}

/**
 * Chalk style functions for message text
 *
 * Only levels that need distinct message styling are listed.
 * Unlisted levels render message text without styling.
 */
const messageStyleFns = {
  error: chalk.red,
}

/**
 * Emoji map for prefix styles
 */
const EMOJI_MAP = {
  build: '🔨',
  cli: '⚡',
  conf: '⚙️',
  epub: '📚',
  pdf: '📄',
  quire: '📖',
}

/**
 * Environment variable for log level configuration
 * Set by CLI startup from config, can be overridden by CLI flags
 */
export const LOG_LEVEL_ENV_VAR = 'QUIRE_LOG_LEVEL'

/**
 * Format the log prefix based on configuration style
 *
 * @param {string} style - Prefix style (bracket, emoji, plain, none)
 * @param {string} text - Prefix text
 * @returns {string} Formatted prefix
 */
function formatPrefix(style, text) {
  switch (style) {
    case 'bracket':
      return `[${text}]`
    case 'emoji':
      return EMOJI_MAP[text] || '📖'
    case 'plain':
      return `${text}:`
    case 'none':
      return ''
    default:
      return `[${text}]`
  }
}

/**
 * Resolve log level from various sources
 *
 * Priority order:
 * 1. Explicit level parameter (for createLogger calls with specific level)
 * 2. QUIRE_LOG_LEVEL environment variable (set by CLI from config/flags)
 * 3. Config file setting
 * 4. Default to 'info'
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

  // Check config
  const configLevel = config.get('logLevel')
  if (configLevel && LOG_LEVELS[configLevel] !== undefined) {
    return LOG_LEVELS[configLevel]
  }

  // Default to info
  return LOG_LEVELS.info
}

/**
 * Create a logger instance
 *
 * @param {string} [name='quire'] - Logger name for loglevel instance
 * @param {string|number} [level] - Log level (trace, debug, info, warn, error, silent)
 * @returns {Object} Logger instance with trace, debug, info, warn, error, setLevel methods
 */
export default function createLogger(name = 'quire', level) {
  const loggerInstance = log.getLogger(name)
  loggerInstance.setLevel(resolveLevel(level), false)

  /**
   * Create a log function for a specific level
   */
  const createLogFn = (type) => {
    const logMethod = loggerInstance[type]
    const styleLabel = lableStyleFns[type]
    const styleMessage = messageStyleFns[type]

    return (...args) => {
      // Read config each time to support runtime changes
      const prefix = config.get('logPrefix')
      const prefixStyle = config.get('logPrefixStyle')
      const showLevel = config.get('logShowLevel')
      const useColor = config.get('logUseColor')
      const colorMessages = config.get('logColorMessages')

      const parts = []

      // Add prefix
      const formattedPrefix = formatPrefix(prefixStyle, prefix)
      if (formattedPrefix) {
        if (useColor) {
          parts.push(styleLabel(chalk.bold(formattedPrefix)))
        } else {
          parts.push(formattedPrefix)
        }
      }

      // Add level label
      if (showLevel) {
        const levelLabel = type.toUpperCase().padEnd(5, ' ')
        if (useColor) {
          parts.push(styleLabel(levelLabel))
        } else {
          parts.push(levelLabel)
        }
      }

      // Format message with printf-style substitution (%s, %d, %i, %o, %O, %j)
      const message = format(...args)

      logMethod(...parts, useColor && colorMessages && styleMessage ? styleMessage(message) : message)
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
 */
export const logger = createLogger('quire')
