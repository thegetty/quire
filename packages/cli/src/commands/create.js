import Command from '#src/Command.js'
import { quire } from '#src/lib/quire/index.js'

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
    version: '1.0.0',
    args: [
      [ '[projectPath]', 'local path to the new project', '.' ],
      [ '[starter]', 'repository url or local path for a starter project' ],
    ],
    options: [
      [ '--quire <version>', 'quire-11ty version to install', 'latest' ],
      // [ '--eject', 'install quire-11ty into the project directory', true ],
      [ '--debug', 'debug the `quire new` command', false ],
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
    if (options.debug) {
      console.info('Command \'%s\' called with options %o', CreateCommand.name, options)
    }

    if (!projectPath && !starter) {
      // @TODO implement this case of interactively selecting starter templates
      // from available subtrees in `lib/quire` module

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
      const requiredVersion = await quire.initStarter(starter, projectPath)
      if (!requiredVersion) return

      options.eject = true

      if (options.eject) {
        await quire.installInProject(projectPath, options)
      } else {
        await quire.install(options)
      }
    }
  }
}
