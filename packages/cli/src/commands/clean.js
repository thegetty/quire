import Command from '#src/Command.js'
import { withOutputModes } from '#lib/commander/index.js'
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
  static definition = withOutputModes({
    name: 'clean',
    description: 'Remove build outputs',
    summary: 'delete generated files',
    docsLink: 'quire-commands/#output-files',
    helpText: `
Examples:
  quire clean                  Remove build outputs
  quire clean --dry-run        Preview files to be deleted
  quire clean --verbose        Clean with detailed progress
`,
    version: '1.0.0',
    options: [
      [ '-d, --dry-run', 'show paths to be cleaned without deleting files' ],
      [ '--dryrun', 'alias for --dry-run', { hidden: true, implies: { dryRun: true } } ],
    ],
  })

  constructor() {
    super(CleanCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    const deletedPaths = await clean(paths.getProjectRoot(), paths.toObject(), options)

    if (!deletedPaths || !deletedPaths.length) {
      this.logger.info('No files to delete')
      return
    }

    const verb = options.dryRun ? 'Will delete' : 'Deleted'
    const listing = deletedPaths.map((p) => `  ${p}`).join('\n')
    this.logger.info(`${verb} ${deletedPaths.length} file(s):\n${listing}`)
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
