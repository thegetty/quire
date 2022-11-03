import Command from '#src/Command.js'
import { cwd } from 'node:process'
import fs from 'fs-extra'
import hostedGitInfo from 'hosted-git-info'
import { initStarter } from '#src/lib/quire/init-starter.js'
import installNpmVersion from 'install-npm-version'
import { isEmpty } from '#helpers/is-empty.js'
import { join } from 'node:path'
// @todo pull this information from the published packaged
import packageJson from '../../../11ty/package.json' assert { type: 'json' }

const {
  name: quirePackageName,
  version: quire11tyVersion
} = packageJson

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
      [ '[path]', 'local path to the new project', '.' ],
      [ '[starter]', 'repository url or local path for a starter project' ],
    ],
    options: [
      [ '--debug', 'debug the `quire new` command' ],
    ],
  }

  /**
   * Retrieves version from quire repository `packages/11ty/package.json`
   *
   * Note: This does not currently work, as quire-11ty work is not on the main
   * branch yet, and `hosted-git-info` does not provide a mechanism for
   * retrieving file URLs on specific code branches. But it will!
   *
   * @TODO Once 11ty work is merged into main, this static method should replace
   * the `quire11tyVersion` import, and should be refactored to use npm instead of
   *  hosted-git-info
   *
   * @return {String} the current version of thegetty/quire/packages/11ty
   */
  static async getLatestQuireVersion() {
    const latestQuirePackageJsonUrl = hostedGitInfo
      .fromUrl('git@github.com:thegetty/quire.git')
      .file('packages/11ty/package.json')
    const latestQuirePackageJsonRequest = await fetch(latestQuirePackageJsonUrl)
    const latestQuirePackageJson = await latestQuirePackageJsonRequest.json()
    const { version: latestQuireVersion } = latestQuirePackageJson
    return latestQuireVersion
  }

  constructor() {
    super(CreateCommand.definition)
  }

  async action(path, starter, options = {}) {
    if (options.debug) {
      console.info('Command \'%s\' called with options %o', this.name, options)
    }

    const projectRoot = path || cwd()
    starter = starter || `quire/starters/default`

    // ensure that the target path exists
    fs.ensureDirSync(projectRoot)

    // if the target directory exists it must be empty
    if (!isEmpty(path)) {
      const location = path === '.' ? 'the current directory' : path
      console.error(`[CLI] cannot create a starter project in ${location} because it is not empty`)
      // @TODO cleanup directories from failed new command
      return
    }

    // ensure that quire versions directory path exists
    const quire11tyVersionsPath = join('quire', 'versions')
    fs.ensureDirSync(quire11tyVersionsPath)

    // install quire-11ty npm package into /quire/versions/1.0.0
    await installNpmVersion.Install(
      `${quirePackageName}@${quire11tyVersion}`,
      {
        Destination: `../${quire11tyVersionsPath}/${quire11tyVersion}`,
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
      initStarter(starter, projectRoot, quire11tyVersion)
    }
  }
}
