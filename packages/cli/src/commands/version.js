import Command from '#src/Command.js'
import * as quire from '#lib/quire/index.js'

/**
 * Quire CLI `version` Command
 *
 * Running `quire version` sets the `quire-11ty` version for a project.
 * The version is written to a `.quire` file in the project directory
 * or to the `quire-cli` package `.quire` when the `global` flag is used.
 *
 * @class      VersionCommand
 * @extends    {Command}
 */
export default class VersionCommand extends Command {
  static definition = {
    name: 'version',
    description: 'Sets the Quire version to use when running commands on the project.',
    summary: 'set the @thegetty/quire-11ty version',
    version: '1.0.0',
    args: [
      [ '<version>', 'the local quire version to use' ],
    ],
    options: [
      [ '-g', '--global', 'set the quire version globally' ],
    ],
  }

  constructor() {
    super(VersionCommand.definition)
  }

  async action(path, starter, options = {}) {
    if (options.debug) {
      console.info('Command \'%s\' called with options %o', this.name, options)
    }
  }
}
