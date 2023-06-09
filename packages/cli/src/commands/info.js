import Command from '#src/Command.js'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `info` Command
 *
 * Runs the Eleventy `info` to generate static output.
 *
 * @class      InfoCommand
 * @extends    {Command}
 */
export default class InfoCommand extends Command {
  static definition = {
    name: 'info',
    description: 'List Quire cli, quire-11ty, and node versions',
    summary: 'list info',
    version: '1.0.0',
    args: [],
    options: [
      [ '--debug', 'include os versions in output' ],
    ],
  }

  constructor() {
    super(InfoCommand.definition)
  }

  action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }
    console.debug('[CLI] Command \'%s\' called', this.name())
  }

  preAction(command) {
    testcwd(command)
  }
}
