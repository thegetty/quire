import Command from '#src/Command.js'

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
    this.debug('called with options %O', options)

    const lines = [`quire-cli configuration ${this.config.path}`, '']

    for (const [key, value] of Object.entries(this.config.store)) {
      if (key.startsWith('__internal__') && !options.debug) continue
      lines.push(`  ${key}: ${JSON.stringify(value)}`)
    }

    this.logger.info(lines.join('\n'))
  }
}
