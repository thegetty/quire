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
   * @property {Array<String>} aliases
   * @property {String} descriptions
   * @property {Array<CommandArgument>} args
   * @property {Array<CommandOption>} options
   * @property {String} version
   * @property {Boolean} hidden
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

    this.name = definition.name
    this.aliases = definition.aliases
    this.description = definition.description
    this.args = definition.args
    this.options = definition.options
    this.version = definition.version
    this.hidden = definition.hidden
  }

  definition() {
    return this.prototype.definition
  }

  action() {
    throw Error(`Command '${this.name}' has not been implemented.`)
  }
}
