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
    description: 'Start a new Quire project from a template or clone of an existing project from a git repository.',
    summary: 'create a new project',
    version: '1.0.0',
    args: [
      [ '[path]', 'the path to the project directory' ],
      [ '[template]', 'template path or repository url' ]
    ],
    options: [
      [ '-D', '--debug', 'debug the `quire new` command' ],
    ],
  }

  constructor() {
    super(CreateCommand.definition)
  }

  action(options = {}) {
    if (options.debug) {
      console.info('Command \'%s\' called with options %o', this.name, options)
    }
    // list sub-repositories in '@thegetty/quire/packages/starters'
    // const starters = git.fetchStarters()
    // const template = starters['default']
    // `git clone template args.path`
  }
}
