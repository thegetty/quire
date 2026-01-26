/**
 * Pure helper functions for Quire configuration
 *
 * Provides schema-aware validation, coercion, and formatting
 * without side effects or dependencies on the Conf instance.
 *
 * Nota bene: these functions import only schema and defaults (pure data),
 * avoiding circular dependencies with the logger module.
 */
import schema from './schema.js'
import defaults from './defaults.js'

/**
 * Check whether a key is a valid configuration key
 *
 * @param {string} key - Configuration key to check
 * @returns {boolean} True if the key exists in the schema
 */
export function isValidKey(key) {
  return Object.hasOwn(schema, key)
}

/**
 * Get all valid configuration keys
 *
 * @returns {string[]} Sorted array of valid configuration keys
 */
export function getValidKeys() {
  return Object.keys(schema).sort()
}

/**
 * Coerce a CLI string value to the appropriate type based on schema
 *
 * @param {string} key - Configuration key
 * @param {string} value - String value from CLI input
 * @returns {*} Coerced value matching the schema type
 */
export function coerceValue(key, value) {
  const keySchema = schema[key]
  if (!keySchema) return value

  switch (keySchema.type) {
    case 'boolean':
      if (value === 'true' || value === '1') return true
      if (value === 'false' || value === '0') return false
      return value
    case 'number': {
      const num = Number(value)
      return isNaN(num) ? value : num
    }
    default:
      return value
  }
}

/**
 * Format a validation error with helpful information from the schema
 *
 * @param {string} key - Configuration key
 * @param {*} value - The invalid value
 * @returns {string} Formatted multiline error message
 */
export function formatValidationError(key, value) {
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
 * Get the default value for a configuration key
 *
 * @param {string} key - Configuration key
 * @returns {*} Default value, or undefined if key has no default
 */
export function getDefault(key) {
  return defaults[key]
}

/**
 * Get the description for a configuration key from the schema
 *
 * @param {string} key - Configuration key
 * @returns {string|undefined} Description string, or undefined if not found
 */
export function getKeyDescription(key) {
  return schema[key]?.description
}

/**
 * Format all settings as a human-readable string
 *
 * @param {Object} store - Configuration store (key-value pairs)
 * @param {Object} [options]
 * @param {boolean} [options.showInternal=false] - Include __internal__ keys
 * @param {string} [options.configPath] - Path to the config file (shown in header)
 * @returns {string} Formatted multiline settings display
 */
export function formatSettings(store, { showInternal = false, configPath } = {}) {
  const lines = []

  if (configPath) {
    lines.push(`quire-cli configuration ${configPath}`)
  } else {
    lines.push('quire-cli configuration')
  }
  lines.push('')

  for (const [key, value] of Object.entries(store)) {
    if (key.startsWith('__internal__') && !showInternal) continue
    const description = getKeyDescription(key)
    lines.push(`  ${key}: ${JSON.stringify(value)}`)
    if (description) {
      lines.push(`    ${description}`)
    }
  }

  lines.push('')
  lines.push('Use "quire settings set <key> <value>" to change a setting')

  return lines.join('\n')
}
