/**
 * Display formatting functions for Quire configuration
 *
 * Provides human-readable formatting with optional chalk styling.
 * Separated from helpers.js to isolate the chalk dependency
 * from the pure validation/coercion functions.
 *
 * @see ./helpers.js for schema-aware validation and coercion
 */
import chalk from 'chalk'
import schema from './schema.js'

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
 * @param {string} [options.configPath] - Path to the config file (shown in header)
 * @param {boolean} [options.showInternal=false] - Include __internal__ keys
 * @param {boolean} [options.useColor=false] - Apply chalk styling to output
 * @returns {string} Formatted multiline settings display
 */
export function formatSettings(store, { configPath, showInternal = false, useColor = false } = {}) {
  const style = useColor
    ? { bold: chalk.bold, cyan: chalk.cyan, dim: chalk.dim }
    : { bold: (s) => s, cyan: (s) => s, dim: (s) => s }

  const lines = []

  if (configPath) {
    lines.push(style.bold(`quire-cli configuration ${configPath}`))
  } else {
    lines.push(style.bold('quire-cli configuration'))
  }
  lines.push('')

  for (const [key, value] of Object.entries(store)) {
    if (key.startsWith('__internal__') && !showInternal) continue
    const description = getKeyDescription(key)
    lines.push(`  ${style.cyan(key)}: ${JSON.stringify(value)}`)
    if (description) {
      lines.push(`    ${style.dim(description)}`)
    }
  }

  lines.push('')
  lines.push(style.dim('Use "quire settings set <key> <value>" to change a setting'))

  return lines.join('\n')
}
