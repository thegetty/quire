import Command from '#src/Command.js'
import schema from '#lib/conf/schema.js'
import defaults from '#lib/conf/defaults.js'

/**
 * Valid operations for the conf command
 */
const OPERATIONS = ['get', 'set', 'delete', 'reset', 'path']

/**
 * Quire CLI `conf` Command
 *
 * Manages quire-cli configuration with explicit subcommand operations.
 *
 * @example
 * // Show all configuration
 * quire conf
 *
 * // Get a single value
 * quire conf get logLevel
 *
 * // Set a value
 * quire conf set logLevel debug
 *
 * // Delete a key (reset to default)
 * quire conf delete logLevel
 *
 * // Reset all configuration to defaults
 * quire conf reset
 *
 * // Reset a single key to default
 * quire conf reset logLevel
 *
 * // Show config file path
 * quire conf path
 *
 * @class      ConfCommand
 * @extends    {Command}
 */
export default class ConfCommand extends Command {
  static definition = {
    name: 'conf',
    aliases: ['config', 'configure'],
    description: 'Manage the Quire CLI configuration.',
    summary: 'read/write quire-cli configuration options',
    docsLink: 'quire-commands/',
    helpText: `
Examples:
  quire conf                    Show all configuration
  quire conf get <key>          Get a single value
  quire conf set <key> <value>  Set a value
  quire conf delete <key>       Delete (reset to default)
  quire conf reset [key]        Reset all or single key
  quire conf path               Show config file path
`,
    version: '2.0.0',
    args: [
      ['[operation]', `operation to perform (${OPERATIONS.join(', ')})`],
      ['[key]', 'configuration key'],
      ['[value]', 'value to set (for set operation)'],
    ],
    options: [
      ['--debug', 'run command in debug mode'],
    ],
  }

  constructor() {
    super(ConfCommand.definition)
  }

  /**
   * Coerce a string value to the appropriate type based on schema
   *
   * @param {string} key - Configuration key
   * @param {string} value - String value from CLI
   * @returns {*} Coerced value
   */
  #coerceValue(key, value) {
    const keySchema = schema[key]
    if (!keySchema) return value

    switch (keySchema.type) {
      case 'boolean':
        if (value === 'true' || value === '1') return true
        if (value === 'false' || value === '0') return false
        return value
      case 'number':
        const num = Number(value)
        return isNaN(num) ? value : num
      default:
        return value
    }
  }

  /**
   * Format a validation error with helpful information
   *
   * @param {string} key - Configuration key
   * @param {*} value - Invalid value
   * @returns {string} Formatted error message
   */
  #formatValidationError(key, value) {
    const keySchema = schema[key]
    const lines = [`Invalid value for '${key}': ${JSON.stringify(value)}`]

    if (keySchema) {
      if (keySchema.enum) {
        lines.push(`Valid values: ${keySchema.enum.join(', ')}`)
      }
      if (keySchema.description) {
        lines.push(`Description: ${keySchema.description}`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Get a single configuration value
   *
   * @param {string} key - Configuration key
   */
  #getValue(key) {
    if (!key) {
      this.logger.error('Usage: quire conf get <key>')
      return
    }

    if (!Object.hasOwn(schema, key) && !key.startsWith('__internal__')) {
      this.logger.error(`Unknown configuration key: ${key}`)
      this.logger.info(`Valid keys: ${Object.keys(schema).join(', ')}`)
      return
    }

    const value = this.config.get(key)
    if (value === undefined) {
      this.logger.info(`${key}: (not set)`)
    } else {
      this.logger.info(`${key}: ${JSON.stringify(value)}`)
    }
  }

  /**
   * Set a configuration value
   *
   * @param {string} key - Configuration key
   * @param {string} value - Value to set
   */
  #setValue(key, value) {
    if (!key || value === undefined) {
      this.logger.error('Usage: quire conf set <key> <value>')
      return
    }

    if (!Object.hasOwn(schema, key)) {
      this.logger.error(`Unknown configuration key: ${key}`)
      this.logger.info(`Valid keys: ${Object.keys(schema).join(', ')}`)
      return
    }

    const coercedValue = this.#coerceValue(key, value)

    try {
      this.config.set(key, coercedValue)
      this.logger.info(`${key}: ${JSON.stringify(coercedValue)}`)
    } catch {
      this.logger.error(this.#formatValidationError(key, coercedValue))
    }
  }

  /**
   * Delete a configuration key (resets to default)
   *
   * @param {string} key - Configuration key
   */
  #deleteKey(key) {
    if (!key) {
      this.logger.error('Usage: quire conf delete <key>')
      return
    }

    if (!Object.hasOwn(schema, key)) {
      this.logger.error(`Unknown configuration key: ${key}`)
      this.logger.info(`Valid keys: ${Object.keys(schema).join(', ')}`)
      return
    }

    this.config.delete(key)
    const defaultValue = defaults[key]
    this.logger.info(`${key}: reset to ${JSON.stringify(defaultValue)}`)
  }

  /**
   * Reset configuration to defaults
   *
   * @param {string} [key] - Optional key to reset (resets all if omitted)
   */
  #reset(key) {
    if (key) {
      if (!Object.hasOwn(schema, key)) {
        this.logger.error(`Unknown configuration key: ${key}`)
        this.logger.info(`Valid keys: ${Object.keys(schema).join(', ')}`)
        return
      }
      this.config.reset(key)
      const defaultValue = defaults[key]
      this.logger.info(`${key}: reset to ${JSON.stringify(defaultValue)}`)
    } else {
      this.config.clear()
      this.logger.info('Configuration reset to defaults')
    }
  }

  /**
   * Show all configuration values
   */
  #showAll(options) {
    const lines = [`quire-cli configuration ${this.config.path}`, '']

    for (const [key, value] of Object.entries(this.config.store)) {
      if (key.startsWith('__internal__') && !options.debug) continue
      lines.push(`  ${key}: ${JSON.stringify(value)}`)
    }

    this.logger.info(lines.join('\n'))
  }

  /**
   * Show config file path
   */
  #showPath() {
    this.logger.info(this.config.path)
  }

  /**
   * @param {string} [operation] - Operation to perform
   * @param {string} [key] - Configuration key
   * @param {string} [value] - Value to set
   * @param {Object} options - Command options
   * @return {Promise}
   */
  async action(operation, key, value, options = {}) {
    this.debug('called with operation=%s key=%s value=%s options=%O', operation, key, value, options)

    // Validate operation if provided
    if (operation && !OPERATIONS.includes(operation)) {
      this.logger.error(`Unknown operation: ${operation}`)
      this.logger.info(`Valid operations: ${OPERATIONS.join(', ')}`)
      return
    }

    // Dispatch to operation handler
    switch (operation) {
      case 'get':
        return this.#getValue(key)
      case 'set':
        return this.#setValue(key, value)
      case 'delete':
        return this.#deleteKey(key)
      case 'reset':
        return this.#reset(key)
      case 'path':
        return this.#showPath()
      default:
        return this.#showAll(options)
    }
  }
}
