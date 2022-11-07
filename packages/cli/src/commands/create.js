import Command from '#src/Command.js'
import fs from 'fs-extra'
import hostedGitInfo from 'hosted-git-info'
import installNpmVersion from 'install-npm-version'
import path from 'node:path'
import { cwd } from 'node:process'
import { initStarter } from '#src/lib/quire/init-starter.js'
import { isEmpty } from '#helpers/is-empty.js'

/**
 * Nota bene: importing JSON is experimental in Node ES6 modules,
 * instead read the file synchronosly and parse contents as JSON.
 *
 * @refactor this as a concern of the lib/quire module,
 * pull version information from the published packaged
 */
const {
  name: quirePackageName,
  version: quireVersion
} = JSON.parse(fs.readFileSync('../11ty/package.json', 'utf8'))

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
      [ '--debug', 'debug the `quire new` command' ],
    ],
  }

  constructor() {
    super(CreateCommand.definition)
  }

  /**
   * @param      {String}  projectPath
   * @param      {String}  starter
   * @param      {Object} options
   * @return     {Promise}
   */
  async action(projectPath, starter, options = {}) {
    if (options.debug) {
      console.info('Command \'%s\' called with options %o', this.name, options)
    }

    const projectRoot = projectPath || cwd()

    /**
     * @todo refactor as a concern of `lib/quire/init-starter`
     */
    starter = starter || `quire/starters/default`

    // ensure that the target path exists
    fs.ensureDirSync(projectRoot)

    // if the target directory exists it must be empty
    if (!isEmpty(projectPath)) {
      const location = projectPath === '.' ? 'the current directory' : projectPath
      console.error(`[CLI] cannot create a starter project in ${location} because it is not empty`)
      // @TODO cleanup directories from failed new command
      return
    }

    /**
     * Ensure that quire versions directory path exists
     * @todo refactor as a concern of the `lib/quire` module
     */
    const quireVersionsPath = path.join('quire', 'versions')
    fs.ensureDirSync(quireVersionsPath)

    /**
     * Install quire-11ty npm package into /quire/versions/1.0.0
     * @TODO refactor as a concern of the `lib/quire` module
     * @TODO delete `LICENSE`, `CHANGELOG` from new project
     * @TODO handle merging of `package.json` files in starter and `quire-11ty`
     */
    await installNpmVersion.Install(
      `${quirePackageName}@${quireVersion}`,
      {
        Destination: `../${quireVersionsPath}/${quireVersion}`,
        Debug: true
      }
    )

    console.log('[CLI]', projectRoot, starter)

    if (!projectRoot && !starter) {
      // await interactivePrompt()
      // list sub-repositories in '@thegetty/quire/packages/starters'
      // const starters = git.fetchStarters()
      // const starter = starters['default']
      // `git clone starter path`
    } else {
      initStarter(starter, projectRoot, quireVersion)
    }
  }
}
