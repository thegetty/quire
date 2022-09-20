/**
 * Command
 * @abstract
 */
export default class Command {
  constructor(name, description, args, options) {
    if (this.constructor.prototype === Command) {
      throw new Error('Command is an *abstract* class')
    }

    this.command = name
    this.description = description
    this.arguments = []
    this.options = []
    this.version = null
    this.hidden = false
    this.result = null
  }

  definition () {
    return {
      command: this.command,
      help: this.help,
      arguments: this.args,
      options: this.options,
    }
  }

  action (name, options, command) {
    throw Error(`The ${this.command} command has not been implemented.`)
  }
}
