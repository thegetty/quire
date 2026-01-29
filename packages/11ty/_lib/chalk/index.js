import { format } from 'node:util'
import chalk from 'chalk'
import log from 'loglevel'

/**
 * A factory function for custom logging methods using loglevel and chalk
 *
 * Output format is controlled by environment variables set by the CLI:
 * - QUIRE_LOG_LEVEL: log level (trace, debug, info, warn, error, silent)
 * - QUIRE_LOG_PREFIX: formatted prefix tag, e.g. '[quire]' or 'quire:'
 * - QUIRE_LOG_SHOW_LEVEL: 'true' or 'false' to toggle level label
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
 * @param  {Loglevel} loglevel  Disables all logging below the given level
 *
 * @return {Object}  Logger with methods `debug`, error`, `info`, `trace` ,`warn`
 */
export default function (prefix = '', loglevel) {
  // Resolve log level: explicit param > QUIRE_LOG_LEVEL env var > default (info)
  if (loglevel === undefined) {
    loglevel = process.env.QUIRE_LOG_LEVEL || 'info'
  }

  /**
   * Get a new logger object and set logging level (non-persistent)
   * @see https://github.com/pimterry/loglevel
   */
  const logger = log.getLogger(prefix)
  logger.setLevel(loglevel, false)

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
