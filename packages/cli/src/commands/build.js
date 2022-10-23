import Command from '#src/Command.js'
import cli from '#lib/11ty/cli.js'
import eleventy from '#lib/11ty/eleventy.js'

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
      //   '[formats]', 'output formats',
      //   {
      //     choices: ['html', 'pdf', 'epub'],
      //     default: ['html', 'html only']
      //   }
      // ],
    ],
    options: [
      [ '-d', '--dry-run', 'run build without writing files' ],
      [ '-q', '--quiet', 'run build with no console messages' ],
      [ '-v', '--verbose', 'run build with verbose console messages' ],
      [ '--debug', 'run build with debug output to console' ],
      [
        '--lib <lib>', 'run build using the specified lib module', 'cli',
        // { choices: ['cli', 'eleventy'], default: 'cli' }
      ],
    ],
  }

  constructor() {
    super(BuildCommand.definition)
  }

  action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this, options)
    }

    if (options.lib === 'cli') {
      console.debug('[CLI] running build using lib/11ty/cli')
      cli.build(options)
    } else {
      console.debug('[CLI] running build using lib/11ty/eleventy')
      eleventy.build(options)
    }
  }
}
