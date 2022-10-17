import Command from '#src/Command.js'
import eleventy from '#lib/11ty/eleventy.js'

/**
 * Quire CLI `build` Command
 *
 * @class      BuildCommand
 * @extends    {Command}
 */
export default class BuildCommand extends Command {
  static definition = {
    name: 'build',
    // usage: '',
    description: 'Generate publication outputs',
    // summary: '',
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
      ['-D', '--debug', 'debug the `quire build` command'],
      ['-d', '--dry-run', 'run build without writing files'],
    ],
  }

  constructor() {
    super(BuildCommand.definition)
  }

  action(options = {}) {
    console.error('Command \'%s\' called with options %o', this.name, options)
    eleventy.build(options)
  }
}
