import Command from '#src/Command.js'
import { clean } from '#helpers/clean.js'
import paths from '#lib/project/index.js'
import testcwd from '#helpers/test-cwd.js'

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
    summary: 'delete generated files',
    docsLink: 'quire-commands/#output-files',
    helpText: `
Example:
  quire clean --dry-run    Preview files to be deleted
`,
    version: '1.0.0',
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
    this.debug('called with options %O', options)

    const deletedPaths = await clean(paths.getProjectRoot(), paths.toObject(), options)

    const message = deletedPaths && deletedPaths.length
      ? `the following files ${options.dryRun ? 'will be' : 'have been'} deleted:`
      : 'no files to delete'

    this.debug('%s\n%s', message, deletedPaths.join('\n'))
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
