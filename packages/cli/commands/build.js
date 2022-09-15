import Command from './Command.js'

/**
 * Quire CLI `build` Command
 *
 */
export default class Build extends Command {
  constructor(name, description, args=[], options=[]) {
    super()

    this.command = name
    this.help = description
    this.arguments = args
    this.options = options
    this.version = '1.0.0'
    this.result = null
  }

  getResult () {
    return this.result
  }

  definition () {
    return {
      command: this.command,
      help: this.help,
      arguments: this.args,
      options: this.options
    }
  }

  action (options) {
    throw Error(`The ${command} command has not been implemented`)
  }
}
