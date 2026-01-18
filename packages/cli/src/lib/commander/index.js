/**
 * Commander.js utilities
 *
 * Provides helper functions for converting array-based definitions
 * to Commander.js Argument and Option objects.
 *
 * @module lib/commander
 */
import { Argument, Option } from 'commander'

/**
 * Convert array argument definition to Argument object
 *
 * @param {Array} entry - Argument definition array [name, description, { choices, default }]
 * @returns {Argument} Commander Argument object
 * @see https://github.com/tj/commander.js#more-configuration-1
 *
 * @example
 * // Required argument
 * arrayToArgument(['<version>', 'quire-11ty version to use'])
 *
 * @example
 * // Optional argument with default
 * arrayToArgument(['[starter]', 'starter template', { default: 'default' }])
 */
export function arrayToArgument(entry) {
  const [name, description, config = {}] = entry
  const argument = new Argument(name, description)
  if (config.choices) argument.choices(config.choices)
  if (config.default) argument.default(config.default)
  return argument
}

/**
 * Convert array option definition to Option object
 *
 * Supports two array formats:
 * - Separate flags: ['-s', '--long <value>', 'description', default, { choices, default }]
 * - Combined flags: ['--long <value>', 'description', default, { choices, default }]
 *
 * @param {Array} entry - Option definition array
 * @returns {Option} Commander Option object
 * @see https://github.com/tj/commander.js/#options
 * @see https://github.com/tj/commander.js/#more-configuration
 *
 * @example
 * // Long-only option
 * arrayToOption(['--debug', 'enable debug output'])
 *
 * @example
 * // Short and long flags
 * arrayToOption(['-v', '--verbose', 'enable verbose output'])
 *
 * @example
 * // Option with choices
 * arrayToOption(['--lib <module>', 'library to use', { choices: ['a', 'b'], default: 'a' }])
 */
export function arrayToOption(entry) {
  const lastElement = entry[entry.length - 1]
  const configObj = typeof lastElement === 'object' && lastElement !== null ? lastElement : null

  let flags, description, defaultValue
  if (entry[0]?.startsWith('-') && entry[1]?.startsWith('--')) {
    // Array has separate elements for short and long option flags
    // @example ['-s', '--long <value>', 'desc', ...]
    flags = `${entry[0]}, ${entry[1]}`
    description = entry[2]
    defaultValue = entry[3]
  } else {
    // Array has a single element with option flags
    // @example ['--long <value>', 'desc', ...]
    flags = entry[0]
    description = entry[1]
    defaultValue = entry[2]
  }

  const option = new Option(flags, description)

  if (configObj) {
    if (configObj.choices) option.choices(configObj.choices)
    if (configObj.default !== undefined) option.default(configObj.default)
  } else if (defaultValue !== undefined) {
    option.default(defaultValue)
  }

  return option
}
