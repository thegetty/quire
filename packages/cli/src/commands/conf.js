import Command from '#src/Command.js'
import logger from '#src/lib/logger.js'

/**
 * Quire CLI `conf` Command
 *
 * @class      ConfCommand
 * @extends    {Command}
 */
export default class ConfCommand extends Command {
  static definition = {
    name: 'conf',
    aliases: ['config', 'configure'],
    description: 'Manage the Quire CLI configuration.',
    summary: 'read/write quire-cli configuration options',
    version: '1.0.0',
    options: [
      [ '--debug', 'run command in debug mode' ],
    ],
  }

  constructor() {
    super(ConfCommand.definition)
  }

  /**
   * @param      {Object}  options
   * @return     {Promise}
   */
  async action(key, value, options = {}) {
    if (options.debug) {
      logger.info('Command \'%s\' called with options %o', this.name(), options)
    }

    // this.outputHelp()

    logger.info('quire-cli configuration %s', this.config.path)

    for (const [ key, value ] of Object.entries(this.config.store)) {
      if (key.startsWith('__internal__') && !options.debug) continue
      logger.info('%s: %O', key, value)
    }
  }
}
