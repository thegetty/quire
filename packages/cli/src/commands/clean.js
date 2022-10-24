import Command from '#src/Command.js'
import { deleteAsync } from 'del'
import path from 'node:path'
import paths from '#lib/11ty/paths.js'

/**
 * Quire CLI `clean` Command
 *
 * Removes files written by the `build` command using the `del` library.
 *
 * Nota bene: this command is distinct from the 11ty npm package script `clean`,
 * to allow different behavoirs for Quire editors and developers.
 *
 * @class      CleanCommand
 * @extends    {Command}
 */
export default class CleanCommand extends Command {
  static definition = {
    name: 'clean',
    description: 'Remove build outputs',
    summary: 'remove build outputs',
    version: '1.0.0',
    args: [
      // [
      //   '[formats]', 'output formats',
      //   {
      //     choices: ['html', 'pdf', 'epub'],
      //     default: ['html', 'html only']
      //   }
      // ],
    ],
    options: [
      [ '-d', '--dry-run', 'show paths to be cleaned without deleting files' ],
      [ '-p', '--progress', 'display progress of removing files' ],
      [ '-v', '--verbose', 'run clean with verbose console messages' ],
      [ '--debug', 'run clean with debug output to console' ],
    ],
  }

  constructor() {
    super(CleanCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name, options)
    }

    const projectRoot = path.resolve(paths.config, '../')

    const pathsToClean = [
      path.join(projectRoot, paths.output),
      path.join(projectRoot, 'public'),
    ]

    /**
     * Log progess of deleted paths
     * @see https://github.com/sindresorhus/del#onprogress
     *
     * @param  {ProgessData}  progress
     * @see https://github.com/sindresorhus/del#progressdata
     */
    const progressLogger = (progress) => {
      console.info('progress', progress)
    }

    process.cwd(projectRoot)

    const deletedPaths = await deleteAsync(pathsToClean, {
      dryRun: options.dryRun,
      force: true,
      onProgress: (options.progress || options.verbose) && progressLogger,
    })

    const message = deletedPaths && deletedPaths.length
      ? `the following files ${options.dryRun ? 'will be' : 'have been'} deleted:`
      : 'no files to delete'

    console.debug(`[CLI] ${message} ${deletedPaths}`)
  }
}
