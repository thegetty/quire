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
    description: 'check that outputs conform to requirements and specifications',
    summary: 'check outputs for validation errors',
    version: '1.0.0',
    args: [
      [
        '[formats...]', 'output formats',
        {
          choices: [ 'site', 'pdf', 'epub' ],
          default: 'site'
        }
      ],
    ],
    options: [
      [ '--a11y [path]', 'run accessability checks' ],
      [ '--debug', 'run command with additional debugging output' ],
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
