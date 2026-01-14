import Command from '#src/Command.js'
import logger from '#src/lib/logger.js'
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
    summary: 'run build',
    version: '1.0.0',
    args: [
      // [
      //   '[formats...]', 'output formats',
      //   {
      //     choices: ['pdf', 'epub'],
      //   }
      // ],
    ],
    options: [
      [ '-d', '--dry-run', 'run build without writing files' ],
      [ '-q', '--quiet', 'run build with no console messages' ],
      [ '-v', '--verbose', 'run build with verbose console messages' ],
      [
        '--11ty <module>', 'use the specified 11ty module', 'cli',
        // { choices: ['api', 'cli'], default: 'cli' }
      ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  constructor() {
    super(BuildCommand.definition)
  }

  action(options, command) {
    if (options.debug) {
      logger.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }

    if (options['11ty'] === 'cli') {
      logger.debug('[CLI] running eleventy using lib/11ty cli')
      cli.build(options)
    } else {
      logger.debug('[CLI] running eleventy using lib/11ty api')
      api.build(options)
    }
  }

  preAction(command) {
    testcwd(command)

    const options = command.opts()
    if (options.debug) {
      logger.debug('[CLI] Calling \'build\' command pre-action with options', options)
    }
    clean(paths.getProjectRoot(), paths.toObject(), options)
  }
}
