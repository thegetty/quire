import Command from '../Command.js'

/**
 * Quire CLI `build` Command
 */
export default class Build extends Command {

  static name = 'build'

  static description = 'Generate publication outputs'

  static args = []

  static options = [
    ['-o', '--outputs <string>', 'HTML, EPUB, PDF'],
  ]

  constructor() {
    super(Build.name, Build.description, Build.args, Build.options)
  }

  action(command, options) {
    if (options.debug) {
      console.error('Called %s with options %o', this.command, options)
    }
    throw Error(`The ${this.command} command has not been implemented`)
  }
}
