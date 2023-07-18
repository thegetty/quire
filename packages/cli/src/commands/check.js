import Command from '#src/Command.js'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `check` Command
 *
 * @class      CheckCommand
 * @extends    {Command}
 */
export default class CheckCommand extends Command {
  static definition = {
    name: 'check',
    description: '',
    summary: '',
    version: '1.0.0',
    args: [],
    options: [
    ],
  }

  constructor() {
    super(CheckCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug(
        '[CLI] Command \'%s\' called with options %o',
        this.name(),
        options
      )
    } else {
      console.debug('[CLI] Command \'%s\' called', this.name())
    }
  }

  preAction(command) {
    testcwd(command)
  }
}