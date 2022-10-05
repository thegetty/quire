/**
 * Command
 * @abstract
 *
 * @typedef CommandArgument
 *
 * @typedef CommandOption
 *
 */
export default class Command {

  /**
   * @typedef CommandDefinition
   * @property {String} name
   * @property {String} descriptions
   * @property {Array<CommandArgument>} args
   * @property {Array<CommandOption>} options
   */
  static definition = null

  /**
   * Constructs a new instance
   *
   * @param {CommandDefinition}  definition  The definition
   */
  constructor(definition) {
    if (this.constructor.prototype === Command) {
      throw new Error('Command is an *abstract* class')
    }

    this.command = definition.name
    this.description = definition.description
    this.args = definition.args
    this.options = definition.options
    // this.version = version
    // this.hidden = hidden
    // this.result = null
  }

  definition() {
    return this.prototype.definition
  }

  action() {
    throw Error(`Command '${this.command}' has not been implemented.`)
  }
}
