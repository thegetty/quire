const chalk = require('chalk')
const log = require('loglevel')

/**
 * A factory function for custom logging methods using loglevel and chalk
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
module.exports = function (prefix='', loglevel=2) {
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

  const logFn = (type) => {
    const log = logger[type]
    const style = styles[type]
    prefix = prefix.padEnd(30, '\u0020')
    return (message) => log(style(chalk.bold(`[quire] ${type.toUpperCase()}\t`), `${prefix}`, message))
  }

  /**
   * @return {Object} Customized console logging methods
   */
  return Object.keys(styles).reduce((logFns, type) => {
    logFns[type] = logFn(type)
    return logFns
  }, {})
}
