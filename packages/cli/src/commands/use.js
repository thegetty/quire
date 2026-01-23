import Command from '#src/Command.js'
import { setVersion } from '#lib/project/index.js'
import { latest } from '#lib/installer/index.js'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `use` Command
 *
 * Running `quire use` sets the `quire-11ty` version for a project.
 * The version is written to a `.quire` file in the project directory.
 *
 * @class      UseCommand
 * @extends    {Command}
 */
export default class UseCommand extends Command {
  static definition = {
    name: 'use',
    aliases: ['version'],
    hidden: true,  // hide command (incomplete functionality; possible Quire v2)
    description: 'Sets the Quire version to use when running commands on the project.',
    summary: 'set project quire-11ty version',
    docsLink: 'quire-commands/',
    version: '1.0.0',
    args: [
      [ '<version>', 'quire-11ty version to use' ],
    ],
    options: [
      // [ '-g', '--global', 'set the quire version globally' ],
    ],
  }

  constructor() {
    super(UseCommand.definition)
  }

  /**
   * Set the quire-11ty version for the current project
   *
   * Validates the version against npm registry before setting.
   * Supports exact versions, semver ranges, and 'latest'.
   *
   * @param {string} version - The quire-11ty version to use
   * @param {Object} options - Command options
   */
  async action(version, options = {}) {
    this.debug('called with options %O', options)

    // Validate and resolve the version against npm registry
    const resolvedVersion = await latest(version)
    setVersion(resolvedVersion)
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
