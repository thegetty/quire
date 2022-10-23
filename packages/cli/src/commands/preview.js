import Command from '#src/Command.js'
import cli from '#lib/11ty/cli.js'
import eleventy from '#lib/11ty/eleventy.js'

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
      //   '[formats]', 'output formats',
      //   {
      //     choices: ['html', 'pdf', 'epub'],
      //     default: ['html', 'html only']
      //   }
      // ],
    ],
    options: [
      [ '-p', '--port <port>', 'configure development server port', 8080 ],
      [ '-q', '--quiet', 'run build in silent mode' ],
      [ '-v', '--verbose', 'run build with verbose console messages' ],
      [ '--debug', 'run build with debug output to console' ],
      [
        '--lib <lib>', 'run build using the specified lib module', 'cli',
        // { choices: ['cli', 'eleventy'], default: 'cli' }
      ],
    ],
  }

  constructor() {
    super(PreviewCommand.definition)
  }

  action(options = {}) {
    if (options.debug) {
      console.info('Command \'%s\' called with options %o', this.name, options)
    }
    eleventy.serve(options)
  }
}
