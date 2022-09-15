/**
 * Command
 * @abstract
 */
export default Command {
  constructor(name, description, args=[], options=[]) {
    if (this.constructor.prototype === Command) {
      throw new Error('Command is an *abstract* class');
    }

    this.command = name
    this.help = description
    this.arguments = args
    this.options = options
    this.version = null
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
