import Command from '#src/Command.js'
import { Option } from 'commander'
import { withOutputModes } from '#lib/commander/index.js'
import { api, cli } from '#lib/11ty/index.js'
import { serve } from '#lib/server/index.js'
import processManager from '#lib/process/manager.js'
import paths from '#lib/project/index.js'
import { clean } from '#helpers/clean.js'
import open from 'open'
import { recordStatus } from '#lib/conf/build-status.js'
import reporter from '#lib/reporter/index.js'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `build` Command
 *
 * Runs the Eleventy `build` to generate static output.
 *
 * @class      BuildCommand
 * @extends    {Command}
 */
export default class BuildCommand extends Command {
  static definition = withOutputModes({
    name: 'build',
    description: 'Generate publication outputs',
    summary: 'generate HTML site files',
    docsLink: 'quire-commands/#output-files',
    helpText: `
Examples:
  quire build                Build the site
  quire build --serve        Build and start static server
  quire build --open         Build, serve, and open browser
  quire build --verbose      Build with detailed progress
  quire build --debug        Build with debug output

Note: Run before "quire pdf" or "quire epub" commands.
`,
    version: '1.1.0',
    options: [
      [ '-d', '--dry-run', 'run build without writing files' ],
      [ '--dryrun', 'alias for --dry-run', { hidden: true, implies: { dryRun: true } } ],
      [ '--serve', 'start static server after build', { conflicts: 'dryRun' } ],
      [ '-p, --port <port>', 'server port', { default: 8080, implies: { serve: true } } ],
      [ '--open', 'open in default browser after build', { implies: { serve: true } } ],
      // Use Option object syntax to configure this as a hidden option
      new Option('--11ty <module>', 'use the specified 11ty module')
        .choices(['api', 'cli']).default('api').hideHelp(),
    ],
  })

  constructor() {
    super(BuildCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    // Configure reporter for this command
    reporter.configure({ quiet: options.quiet, verbose: options.verbose })

    try {
      if (options['11ty'] === 'api') {
        this.debug('running eleventy using lib/11ty api')
        await api.build(options)
      } else {
        this.debug('running eleventy using lib/11ty cli')
        await cli.build(options)
      }
      recordStatus(paths.getProjectRoot(), 'build', 'ok')
    } catch (error) {
      recordStatus(paths.getProjectRoot(), 'build', 'failed')
      throw error
    }

    // Start static server after build if --serve flag is set
    if (options.serve) {
      const port = parseInt(options.port, 10)

      const { url, stop } =
        await serve(paths.getSitePath(), { port, quiet: options.quiet, verbose: options.verbose })

      processManager.onShutdown('serve', stop)

      try {
        if (options.open) open(url)
        await new Promise(() => {})
      } finally {
        processManager.onShutdownComplete('serve')
      }
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)

    const options = thisCommand.opts()
    this.debug('pre-action with options %O', options)
    clean(paths.getProjectRoot(), paths.toObject(), options)
  }
}
