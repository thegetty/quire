import Command from '#src/Command.js'
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
    aliases: ['serve'],
    description: 'Run the development server and watch on file changes',
    summary: 'run the development server',
    docsLink: 'quire-commands/#start-and-preview-projects',
    helpText: `
Example:
  quire preview --port 3000    Run on custom port
`,
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
    this.debug('called with options %O', options)

    if (options['11ty'] === 'api') {
      this.debug('running eleventy using lib/11ty api')
      api.serve(options)
    } else {
      this.debug('running eleventy using lib/11ty cli')
      cli.serve(options)
    }
  }

  preAction(command) {
    testcwd(command)
  }
}
