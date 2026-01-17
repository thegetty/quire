import Command from '#src/Command.js'
import { Option } from 'commander'
import fs from 'fs-extra'
import { installer } from '#lib/installer/index.js'
import { ProjectCreateError } from '#src/errors/index.js'

/**
 * Quire CLI `new` Command
 *
 * Running `quire new` will start a new project at the specified local path;
 * when the local path does not exist it is created,
 * when `path` exists but is not an empty directory an error is thrown.
 *
 * @class      CreateCommand
 * @extends    {Command}
 */
export default class CreateCommand extends Command {
  static definition = {
    name: 'new',
    description: 'Start a new Quire project from a template.',
    summary: 'create a new project',
    docsLink: 'quire-commands/#start-and-preview-projects',
    helpText: `
Examples:
  quire new my-project                        Use default starter
  quire new my-project --quire-version 1.0.0  Pin quire-11ty version
`,
    version: '1.0.0',
    args: [
      [ '[projectPath]', 'local path to the new project', '.' ],
      [ '[starter]', 'repository url or local path for a starter project' ],
    ],
    options: [
      [ '--quire-path <path>', 'local path to quire-11ty package' ],
      [ '--quire-version <version>', 'quire-11ty version to install' ],
      [ '--debug', 'debug the `quire new` command', false ],
      // Use Option object syntax to configure this as a hidden option
      new Option('--clean-cache', 'force clean the npm cache').default(false).hideHelp(),
    ],
  }

  constructor() {
    super(CreateCommand.definition)
  }

  /**
   * @param      {String}  projectPath
   * @param      {String}  starter
   * @param      {Object}  options
   * @return     {Promise}
   */
  async action(projectPath, starter, options = {}) {
    this.debug('called with options %O', options)

    starter = starter || this.config.get('projectTemplate')

    if (!projectPath && !starter) {
      // @TODO implement this case of interactively selecting starter templates
      // from available subtrees in `lib/installer` module

      // await interactivePrompt()
      // list sub-repositories in '@thegetty/quire/packages/starters'
      // const starters = git.fetchStarters()
      // const starter = starters['default']
      // `git clone starter path`
    } else {
      /**
       * @TODO test that `version` is compatible with the `requiredVersion`
       * if version is incompatible or unknown
       *   - interactive mode prompt to continue
       *   - non-interactive mode throw an error and exit the process
       */
      let quireVersion
      try {
        quireVersion = await installer.initStarter(starter, projectPath, options)
      } catch (error) {
        this.logger.error(error.message)
        // Only remove directory if it wasn't pre-existing user content
        if (!error.message.includes('not empty')) {
          fs.removeSync(projectPath)
        }
        throw new ProjectCreateError(projectPath, error.message)
      }

      // Check if initStarter returned without a version
      if (!quireVersion) {
        fs.removeSync(projectPath)
        throw new ProjectCreateError(projectPath, 'Failed to determine Quire version')
      }

      await installer.installInProject(projectPath, quireVersion, options)
    }
  }
}
