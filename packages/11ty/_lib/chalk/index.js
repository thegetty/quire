import { format } from 'node:util'
import chalk from 'chalk'
import log from 'loglevel'

/**
 * A factory function for custom logging methods using loglevel and chalk
 *
 * Output verbosity is controlled by environment variables set by the CLI:
 *
 * - QUIRE_LOG_LEVEL: log level ceiling (trace, debug, info, warn, error, silent).
 *   Acts as a minimum threshold — when both an explicit `loglevel` parameter and
 *   the env var are set, the more restrictive (higher numeric) level wins.
 *   This ensures CLI flags like --quiet always suppress output, even for modules
 *   that request a lower level like 'debug'.
 *
 * - QUIRE_LOG_PREFIX: formatted prefix tag, e.g. '[quire]' or 'quire:'
 * - QUIRE_LOG_SHOW_LEVEL: 'true' or 'false' to toggle level label
 *
 * Without the env var (e.g. running quire-11ty standalone), the explicit
 * `loglevel` parameter or the default ('info') is used unchanged.
 *
 * @see packages/cli/docs/cli-output-modes.md
 *
 * @typedef Loglevel {Number|String} A numeric index or case-insensitive name
 *  [0]: 'trace'
 *  [1]: 'debug'
 *  [2]: 'info'
 *  [3]: 'warn'
 *  [4]: 'error'
 *  [5]: 'silent', which disables all messages from this logger
 *
 * @param  {String} prefix  A module prefix for log messages (e.g. 'Figures:ImageProcessor')
 * @param  {Loglevel} loglevel  Preferred log level; may be overridden by QUIRE_LOG_LEVEL ceiling
 *
 * @return {Object}  Logger with methods `debug`, `error`, `info`, `trace`, `warn`
 */
/**
 * Map log level names to numeric values (matching loglevel library)
 */
const LOG_LEVELS = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, silent: 5 }

/**
 * Convert a log level name or number to its numeric value
 * @param {string|number} level
 * @returns {number}
 */
const toNumeric = (level) => {
  if (typeof level === 'number') return level
  return LOG_LEVELS[String(level).toLowerCase()] ?? LOG_LEVELS.info
}

export default function (prefix = '', loglevel) {
  // Resolve the effective log level.
  // The env var acts as a floor (minimum level) so that CLI flags like
  // --quiet (silent) always win, even when a module requests a lower level
  // like 'debug'. Math.max picks the more restrictive of the two.
  const paramLevel = loglevel !== undefined ? toNumeric(loglevel) : toNumeric('info')
  const envLevel = process.env.QUIRE_LOG_LEVEL
    ? toNumeric(process.env.QUIRE_LOG_LEVEL)
    : null

  const effectiveLevel = envLevel !== null
    ? Math.max(paramLevel, envLevel)
    : paramLevel

  /**
   * Get a new logger object and set logging level (non-persistent)
   * @see https://github.com/pimterry/loglevel
   */
  const logger = log.getLogger(prefix)
  logger.setLevel(effectiveLevel, false)

  /**
   * chalk themes
   * @see https://www.w3.org/wiki/CSS/Properties/color/keywords
   * @see https://github.com/chalk/chalk/tree/v4.1.2#usage
   */
  const styles = {
    debug: chalk.yellow,
    error: chalk.inverse.redBright,
    info: chalk.magenta,
    trace: chalk.white,
    warn: chalk.inverse.yellow
  }

  // Prefix tag: CLI sets QUIRE_LOG_PREFIX to the formatted prefix (e.g. '[quire]')
  const prefixTag = process.env.QUIRE_LOG_PREFIX || '[quire]'

  // Level label visibility: CLI sets QUIRE_LOG_SHOW_LEVEL based on config
  const showLevel = process.env.QUIRE_LOG_SHOW_LEVEL !== 'false'

  const logFn = (type) => {
    const log = logger[type]
    const style = styles[type]
    const moduleName = prefix.padEnd(30, '\u0020')

    return (...args) => {
      const message = format(...args)
      const parts = []
      if (prefixTag) parts.push(chalk.bold(prefixTag))
      if (showLevel) parts.push(`${type.toUpperCase()}\t`)
      parts.push(`${moduleName}`)
      parts.push(message)
      log(style(...parts))
    }
  }

  /**
   * @return {Object} Customized console logging methods
   */
  return Object.keys(styles).reduce((logFns, type) => {
    logFns[type] = logFn(type)
    return logFns
  }, {})
}
