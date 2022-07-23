const chalk = require('chalk')

/**
 * A factory function for custom logging methods using the chalk library
 *
 * @param  {String} prefix  A prefix for messages output to the terminal
 * @return {Function}  An object with custom log methods `error`, `info`, `warn`
 */
module.exports = function (prefix='') {
  /**
   * chalk themes
   * @see https://github.com/chalk/chalk/tree/v4.1.2#usage
   */
  const styles = {
    error: chalk.inverse.redBright,
    info: chalk.magenta,
    warn: chalk.inverse.yellow
  }

  const logFn = (type) => {
    const log = console[type]
    const style = styles[type]
    return (message) => log(style(chalk.bold(`[${prefix}]`), message))
  }

  /**
   * @return {Object} Customized logging methods `error`, `info`, `warn`
   */
  return Object.keys(styles).reduce((logFns, type) => {
    logFns[type] = logFn(type)
    return logFns
  }, {})
}
