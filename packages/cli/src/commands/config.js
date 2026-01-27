import Command from '#src/Command.js'
import schema from '#lib/conf/schema.js'
import defaults from '#lib/conf/defaults.js'

/**
 * Valid operations for the settings command
 */
const OPERATIONS = Object.freeze(['get', 'set', 'delete', 'reset', 'path'])

/**
 * Quire CLI `settings` Command
 *
 * Manages quire-cli configuration with explicit subcommand operations.
 *
 * @example
 * // Show all settings
 * quire settings
 *
 * // Get a single value
 * quire settings get logLevel
 *
 * // Set a value
 * quire settings set logLevel debug
 *
 * // Delete a key (reset to default)
 * quire settings delete logLevel
 *
 * // Reset all settings to defaults
 * quire settings reset
 *
 * // Reset a single key to default
 * quire settings reset logLevel
 *
 * // Show settings file path
 * quire settings path
 *
 * @class      SettingsCommand
 * @extends    {Command}
 */
export default class SettingsCommand extends Command {
  static definition = {
    name: 'settings',
    aliases: ['prefs', 'preferences', 'conf', 'config', 'configure'],
    description: 'Manage Quire CLI settings.',
    summary: 'view and modify CLI settings',
    docsLink: 'quire-commands/',
    helpText: `
Examples:
  quire settings                    Show all settings
  quire settings get <key>          Get a single value
  quire settings set <key> <value>  Set a value
  quire settings delete <key>       Delete (reset to default)
  quire settings reset [key]        Reset all or single key
  quire settings path               Show settings file path
`,
    version: '2.0.0',
    args: [
      ['[operation]', `operation to perform (${OPERATIONS.join(', ')})`],
      ['[key]', 'configuration key'],
      ['[value]', 'value to set (for set operation)'],
    ],
    options: [
      ['--debug', 'enable debug output for troubleshooting'],
    ],
  }

  constructor() {
    super(SettingsCommand.definition)
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
      if ((key.startsWith('__internal__') || key === 'projects') && !options.debug) continue
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
