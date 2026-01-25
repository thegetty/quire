import Command from '#src/Command.js'
import { Option } from 'commander'
import { outputModeOptions, outputModeHelpText } from '#lib/commander/index.js'
import { api, cli } from '#lib/11ty/index.js'
import paths from '#lib/project/index.js'
import { clean } from '#helpers/clean.js'
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
  static definition = {
    name: 'build',
    description: 'Generate publication outputs',
    summary: 'generate HTML site files',
    docsLink: 'quire-commands/#output-files',
    helpText: `
${outputModeHelpText}

Examples:
  quire build                Build the site
  quire build --verbose      Build with detailed progress
  quire build --debug        Build with debug output

Note: Run before "quire pdf" or "quire epub" commands.
`,
    version: '1.1.0',
    options: [
      [ '-d', '--dry-run', 'run build without writing files' ],
      ...outputModeOptions,
      // Use Option object syntax to configure this as a hidden option
      new Option('--11ty <module>', 'use the specified 11ty module')
        .choices(['api', 'cli']).default('api').hideHelp(),
    ],
  }

  constructor() {
    super(BuildCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    // Configure reporter for this command
    reporter.configure({ quiet: options.quiet, verbose: options.verbose })

    reporter.start('Building site...', { showElapsed: true })

    try {
      if (options['11ty'] === 'api') {
        this.debug('running eleventy using lib/11ty api')
        await api.build(options)
      } else {
        this.debug('running eleventy using lib/11ty cli')
        await cli.build(options)
      }
      reporter.succeed('Build complete')
    } catch (error) {
      reporter.fail('Build failed')
      throw error
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)

    const options = thisCommand.opts()
    this.debug('pre-action with options %O', options)
    clean(paths.getProjectRoot(), paths.toObject(), options)
  }
}
