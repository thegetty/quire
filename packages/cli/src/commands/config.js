import Command from '#src/Command.js'
import {
  isValidKey,
  getValidKeys,
  coerceValue,
  formatValidationError,
  getDefault,
  formatSettings,
} from '#lib/conf/index.js'
import { UnknownConfigKeyError, UnknownConfigOperationError } from '#src/errors/index.js'

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
  quire settings --json             Output raw config JSON
  quire settings get <key> --json   Output single value as JSON
`,
    version: '2.0.0',
    args: [
      ['[operation]', `operation to perform (${OPERATIONS.join(', ')})`],
      ['[key]', 'configuration key'],
      ['[value]', 'value to set (for set operation)'],
    ],
    options: [
      ['--json', 'output raw JSON'],
      ['--debug', 'enable debug output for troubleshooting'],
    ],
  }

  constructor() {
    super(SettingsCommand.definition)
  }

  /**
   * Get a single configuration value
   *
   * @param {string} key - Configuration key
   * @param {Object} options - Command options
   */
  #getValue(key, options) {
    if (!key) {
      this.logger.error('Usage: quire conf get <key>')
      return
    }

    if (!isValidKey(key) && !key.startsWith('__internal__')) {
      throw new UnknownConfigKeyError(key, getValidKeys())
    }

    const value = this.config.get(key)

    if (options.json) {
      console.log(JSON.stringify(value))
      return
    }

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

    if (!isValidKey(key)) {
      throw new UnknownConfigKeyError(key, getValidKeys())
    }

    const coercedValue = coerceValue(key, value)

    try {
      this.config.set(key, coercedValue)
      this.logger.info(`${key}: ${JSON.stringify(coercedValue)}`)
    } catch {
      this.logger.error(formatValidationError(key, coercedValue))
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

    if (!isValidKey(key)) {
      throw new UnknownConfigKeyError(key, getValidKeys())
    }

    this.config.delete(key)
    const defaultValue = getDefault(key)
    this.logger.info(`${key}: reset to ${JSON.stringify(defaultValue)}`)
  }

  /**
   * Reset configuration to defaults
   *
   * @param {string} [key] - Optional key to reset (resets all if omitted)
   */
  #reset(key) {
    if (key) {
      if (!isValidKey(key)) {
        throw new UnknownConfigKeyError(key, getValidKeys())
      }
      this.config.reset(key)
      const defaultValue = getDefault(key)
      this.logger.info(`${key}: reset to ${JSON.stringify(defaultValue)}`)
    } else {
      this.config.clear()
      this.logger.info('Configuration reset to defaults')
    }
  }

  /**
   * Show all configuration values with descriptions
   */
  #showAll(options) {
    if (options.json) {
      const store = options.debug
        ? this.config.store
        : Object.fromEntries(
          Object.entries(this.config.store).filter(([k]) =>
            !k.startsWith('__internal__') && k !== 'projects'
          )
        )
      console.log(JSON.stringify(store, null, 2))
      return
    }

    const output = formatSettings(this.config.store, {
      showInternal: options.debug,
      configPath: this.config.path,
      useColor: this.config.get('logUseColor'),
    })
    this.logger.info(output)
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
      throw new UnknownConfigOperationError(operation, [...OPERATIONS])
    }

    // Dispatch to operation handler
    switch (operation) {
      case 'get':
        return this.#getValue(key, options)
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
