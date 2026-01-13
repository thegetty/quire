import config from '#src/lib/conf/config.js'

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
   * @property {String} alias
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
   * Nota bene: Only the first command alias is displayed in the help.
   *
   * @param {CommandDefinition}  definition  The definition
   */
  constructor(definition) {
    if (this.constructor === Command) {
      throw new Error('Command is an *abstract* class')
    }

    this.config = config // quire-cli configuration

    /**
     * Merge and deduplicate command definition alias and aliases
     * Nota bene: Only the first command alias is displayed in the help.
     */
    // let aliases = Array.isArray(definition.aliases) ? definition.aliases || []
    // aliases = new Set([ definition.alias, ...aliases ])

    this.name = definition.name
    this.aliases = definition.aliases
    this.description = definition.description
    this.summary = definition.summary
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
