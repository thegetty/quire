import Command from '#src/Command.js'
import { api, cli, paths, projectRoot  } from '#lib/11ty/index.js'
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
      [ '-p', '--port <port>', 'configure development server port', 8080 ],
      [ '-q', '--quiet', 'run preview in silent mode' ],
      [ '-v', '--verbose', 'run preview with verbose console messages' ],
      [
        '--11ty <module>', 'use the specified 11ty module', 'cli',
        // { choices: ['api', 'cli'], default: 'cli' }
      ],
      [ '--debug', 'run preview with debug output to console' ],
    ],
  }

  constructor() {
    super(PreviewCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with arguments [%o] and options %o', this.name(), options)
    }

    if (options['11ty'] === 'cli') {
      console.debug('[CLI] running eleventy using lib/11ty cli')
      cli.serve(options)
    } else {
      console.debug('[CLI] running eleventy using lib/11ty api')
      api.serve(options)
    }
  }

  preAction(command) {
    testcwd(command)
  }
}
