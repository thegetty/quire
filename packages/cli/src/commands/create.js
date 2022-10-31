import Command from '#src/Command.js'
import { cwd } from 'node:process'
import { initStarter } from '#src/lib/quire/init-starter.js'
import { isEmpty } from '#helpers/is-empty.js'
import fs from 'fs-extra'
import git from '#src/lib/git/index.js'

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

  constructor() {
    super(CreateCommand.definition)
  }

  action(path, starter, options = {}) {
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

    console.log('[CLI]', projectRoot, starter)

    if (!projectRoot && !starter) {
      // await interactivePrompt()
      // list sub-repositories in '@thegetty/quire/packages/starters'
      // const starters = git.fetchStarters()
      // const starter = starters['default']
      // `git clone starter path`
    } else {
      // `git clone starter path`
      // currently we are just copying files directly
      initStarter(starter, projectRoot)
    }
  }
}
