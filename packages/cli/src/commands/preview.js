import Command from '#src/Command.js'
import logger from '#src/lib/logger.js'
import { api, cli } from '#lib/11ty/index.js'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `preview` Command
 *
 * Runs the Eleventy development server in `watch` mode.
 *
 * @class      PreviewCommand
 * @extends    {Command}
 */
export default class PreviewCommand extends Command {
  static definition = {
    name: 'preview',
    description: 'Run the development server and watch on file changes',
    summary: 'run the development server',
    version: '1.1.0',
    options: [
      [ '-p', '--port <port>', 'configure development server port', 8080 ],
      [ '-q', '--quiet', 'run preview in silent mode' ],
      [ '-v', '--verbose', 'run preview with verbose console messages' ],
      [
        '--11ty <module>', 'use the specified 11ty module', 'api',
        { choices: ['api', 'cli'], default: 'api' }
      ],
      [ '--debug', 'run preview with debug output to console' ],
    ],
  }

  constructor() {
    super(PreviewCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      logger.debug('[CLI] Command \'%s\' called with arguments [%o] and options %o', this.name(), options)
    }

    if (options['11ty'] === 'api') {
      logger.debug('[CLI] running eleventy using lib/11ty api')
      api.serve(options)
    } else {
      logger.debug('[CLI] running eleventy using lib/11ty cli')
      cli.serve(options)
    }
  }

  preAction(command) {
    testcwd(command)
  }
}
