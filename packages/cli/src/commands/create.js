import Command from '#src/Command.js'
import eleventy from '#lib/11ty/eleventy.js'

/**
 * Quire CLI `new` Command
 *
 * @class      CreateCommand
 * @extends    {Command}
 */
export default class CreateCommand extends Command {
  static definition = {
    name: 'new',
    // usage: '',
    description: 'Start a new Quire publication from a template or clone of an existing project from a git repository.',
    // summary: '',
    version: '1.0.0',
    args: [
      [
        '[template]', 'Quire project template',
      ],
    ],
    options: [
      ['-D', '--debug', 'debug the `quire new` command'],
    ],
  }

  constructor() {
    super(CreateCommand.definition)
  }

  action(options = {}) {
    console.error('Command \'%s\' called with options %o', this.name, options)
    eleventy.build(options)
  }
}
