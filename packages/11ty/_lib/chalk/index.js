const chalk = require('chalk')

module.exports = function(prefix='') {
  /**
   * chalk themes
   * @see https://github.com/chalk/chalk/tree/v4.1.2#usage
   */
  const styles = {
    info: chalk.magenta,
    error: chalk.bold.red,
    warn: chalk.bold.keyword('yellow')
  }
  const logFn = (type) => {
    const log = console[type]
    const style = styles[type]
    return (message) => log(style(chalk.bold(prefix), message))
  }
  return Object.keys(styles).reduce((logFns, type) => {
    logFns[type] = logFn(type)
    return logFns
  }, {})
}
