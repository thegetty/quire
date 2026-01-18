import config from '#src/lib/conf/config.js'
import createLogger from '#lib/logger/index.js'
import createDebug from '#debug'

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
   * @property {String} name - Command name used to invoke it
   * @property {String} alias - Single alias for the command
   * @property {Array<String>} aliases - Multiple aliases for the command
   * @property {String} description - Full description shown in command's own help
   * @property {String} summary - One-line summary shown in parent help listing
   * @property {String} [docsLink] - Path appended to docs base URL (e.g., 'quire-commands/#output-files')
   * @property {String} [helpText] - Custom help text shown after built-in help (examples, notes)
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
     * Command-specific debug instance for internal debugging
     * Enable via: DEBUG=quire:commands:name or DEBUG=quire:commands:*
     */
    this.debug = createDebug(`commands:${definition.name}`)

    /**
     * Command-specific logger with prefix including command name
     * Output format: [quire] LEVEL commands:name message
     */
    this.logger = createLogger(`commands:${definition.name}`)

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
    this.docsLink = definition.docsLink
    this.helpText = definition.helpText
    this.args = definition.args
    this.options = definition.options
    this.version = definition.version
    this.hidden = definition.hidden
  }

  definition() {
    return this.constructors.definition
  }

  action() {
    throw Error(`Command '${this.name}' has not been implemented.`)
  }
}
