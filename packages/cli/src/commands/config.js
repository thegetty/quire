import Command from '#src/Command.js'

/**
 * Quire CLI `config` Command
 *
 * @class      ConfigCommand
 * @extends    {Command}
 */
export default class ConfigCommand extends Command {
  static definition = {
    name: 'config',
    description: 'Manage the Quire CLI configuration.',
    summary: 'read/write cli configuration options',
    version: '1.0.0',
  }

  constructor() {
    super(ConfigCommand.definition)
  }

  /**
   * @param      {Object}  options
   * @return     {Promise}
   */
  async action(key, value, options = {}) {
    if (options.debug) {
      console.info('Command \'%s\' called with options %o', this.name(), options)
    }

    console.info('[CLI] configuration')

    for (const [ key, value ] of Object.entries(this.config.store)) {
      if (key.startsWith('__internal__') && !options.debug) continue
      console.info(`${key}: ${JSON.stringify(value, null, 2)}`)
    }
  }

  postAction(command) {
    // const options = command.opts()
    // if (options.debug) {
    //   console.debug('[CLI] Calling \'build\' command post-action with options', options)
    // }
  }

  preAction(command) {
    // const options = command.opts()
    // if (options.debug) {
    //   console.debug('[CLI] Calling \'build\' command pre-action with options', options)
    // }
  }
}
