import chalk from 'chalk'
import debug from 'debug'

/**
 * A factory function for custom logging methods using debug and chalk
 *
 * @typedef Loglevel {Number|String} A numeric index or case-insensitive name
 *  [0]: 'trace'
 *  [1]: 'debug'
 *  [2]: 'info'
 *  [3]: 'warn'
 *  [4]: 'error'
 *  [5]: 'silent', which disables all messages from this logger
 *
 * @param  {String} prefix  A prefix for log messages output to the terminal
 * @param  {Loglevel} loglevel  Disables all logging below the given level
 *
 * @return {Object}  Logger with methods `debug`, error`, `info`, `trace` ,`warn`
 */
export default function (prefix = '', loglevel = 2) {
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

  /**
   * Initialize loggers for each loglevel.
   *
   * NB: colors are manually disabled to use color-per-loglevel styling
   *
   * @see https://github.com/debug-js/debug
   */
  prefix = prefix.padEnd(30, '\u0020')

  const loggers = {
    debug: debug(styles.debug(`Quire:${prefix} ${chalk.bold('DEBUG')}\t`)),
    error: debug(styles.error(`Quire:${prefix} ${chalk.bold('ERROR')}\t`)),
    info: debug(styles.info(`Quire:${prefix} ${chalk.bold('INFO')}\t`)),
    trace: debug(styles.trace(`Quire:${prefix} ${chalk.bold('TRACE')}\t`)),
    warn: debug(styles.warn(`Quire:${prefix} ${chalk.bold('WARN')}\t`))
  }

  Object.entries(loggers).forEach(([logLevel, logger]) => {
    logger.useColors = false
  })

  const logFn = (type) => {
    const logger = loggers[type]
    const style = styles[type]
    return (message) => logger(style(message))
  }

  /**
   * @return {Object} Customized console logging methods
   */
  return Object.keys(styles).reduce((logFns, type) => {
    logFns[type] = logFn(type)
    return logFns
  }, {})
}
