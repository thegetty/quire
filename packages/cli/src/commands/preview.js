import Command from '#src/Command.js'
import { Option } from 'commander'
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
    summary: 'start local preview server',
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
      [ '--debug', 'run preview with debug output to console' ],
      // Use Option object syntax to configure this as a hidden option
      new Option('--11ty <module>', 'use the specified 11ty module')
        .choices(['api', 'cli']).default('api').hideHelp(),
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

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
