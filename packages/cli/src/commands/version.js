import Command from '#src/Command.js'
import { setVersion } from '#lib/project/index.js'
import { latest } from '#lib/installer/index.js'
import testcwd from '#helpers/test-cwd.js'

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
    description: 'Sets the Quire version to use when running commands on the project.\n\nDocs: https://quire.getty.edu/docs/quire-commands/',
    summary: 'set the @thegetty/quire-11ty version',
    version: '1.0.0',
    args: [
      [ '<version>', 'the local quire version to use' ],
    ],
    options: [
      // [ '-g', '--global', 'set the quire version globally' ],
    ],
  }

  constructor() {
    super(VersionCommand.definition)
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

  preAction(command) {
    testcwd(command)
  }
}
