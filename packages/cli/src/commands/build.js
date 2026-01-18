import Command from '#src/Command.js'
import { Option } from 'commander'
import { api, cli } from '#lib/11ty/index.js'
import paths from '#lib/project/index.js'
import { clean } from '#helpers/clean.js'
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
    helpText: 'Note: Run before "quire pdf" or "quire epub" commands.',
    version: '1.1.0',
    options: [
      [ '-d', '--dry-run', 'run build without writing files' ],
      [ '-q', '--quiet', 'run build with no console messages' ],
      [ '-v', '--verbose', 'run build with verbose console messages' ],
      [ '--debug', 'run build with debug output to console' ],
      // Use Option object syntax to configure this as a hidden option
      new Option('--11ty <module>', 'use the specified 11ty module')
        .choices(['api', 'cli']).default('api').hideHelp(),
    ],
  }

  constructor() {
    super(BuildCommand.definition)
  }

  action(options, command) {
    this.debug('called with options %O', options)

    if (options['11ty'] === 'api') {
      this.debug('running eleventy using lib/11ty api')
      api.build(options)
    } else {
      this.debug('running eleventy using lib/11ty cli')
      cli.build(options)
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)

    const options = thisCommand.opts()
    this.debug('pre-action with options %O', options)
    clean(paths.getProjectRoot(), paths.toObject(), options)
  }
}
