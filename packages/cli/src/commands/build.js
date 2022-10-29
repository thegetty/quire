import Command from '#src/Command.js'
import { clean } from '#helpers/clean.js'
import cli from '#lib/11ty/cli.js'
import eleventy from '#lib/11ty/eleventy.js'
import paths, { eleventyRoot as projectRoot } from '#lib/11ty/paths.js'

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
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }

    if (options['11ty'] === 'cli') {
      console.debug('[CLI] running eleventy using lib/11ty cli')
      cli.build(options)
    } else {
      console.debug('[CLI] running eleventy using lib/11ty api')
      eleventy.build(options)
    }
  }

  preAction(command) {
    const options = command.opts()
    if (options.debug) {
      console.debug('[CLI] Calling \'build\' command preAction with options', options)
    }
    clean(projectRoot, paths, options)
  }
}
