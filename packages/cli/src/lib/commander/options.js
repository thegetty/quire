/**
 * Shared option definitions for CLI commands
 *
 * Provides consistent option definitions that can be imported by commands.
 * This ensures uniform help text, flags, and behavior across the CLI.
 *
 * ## Recommended Usage
 *
 * Use `withOutputModes()` to wrap your command definition:
 *
 * ```javascript
 * import { withOutputModes } from '#lib/commander/index.js'
 *
 * export default class MyCommand extends Command {
 *   static definition = withOutputModes({
 *     name: 'my-command',
 *     description: 'Do something useful',
 *     helpText: `
 * Examples:
 *   quire my-command --verbose
 * `,
 *     options: [
 *       ['--custom', 'my custom option'],
 *     ],
 *   })
 * }
 * ```
 *
 * This automatically adds --quiet, --verbose, --debug options and prepends
 * the standard output mode help text.
 *
 * ## Selective Options
 *
 * For commands that need only specific output options:
 *
 * ```javascript
 * import { quietOption, verboseOption } from '#lib/commander/index.js'
 *
 * options: [
 *   quietOption,
 *   verboseOption,
 *   // No --debug for this command
 * ]
 * ```
 *
 * ## Commander.js Boolean Negation
 *
 * Boolean options automatically support negation via Commander.js.
 * For example, `--verbose` automatically supports `--no-verbose`.
 *
 * This enables the config fallback pattern:
 * - `--verbose` → options.verbose = true
 * - `--no-verbose` → options.verbose = false
 * - (no flag) → options.verbose = undefined (falls back to config)
 *
 * @see https://github.com/tj/commander.js#other-option-types-negatable-boolean-and-booleanvalue
 * @module lib/commander/options
 */

/**
 * Quiet mode option - suppress progress output
 *
 * Use for CI/CD pipelines and automated scripts where spinner
 * output would clutter logs. Exit codes still indicate success/failure.
 *
 * Conflicts with --verbose and --debug since quiet mode suppresses
 * the output those modes would show.
 *
 * @type {Array}
 */
export const quietOption = [
  '-q, --quiet', 'suppress progress output',
  { conflicts: ['verbose', 'debug'] }
]

/**
 * Verbose mode option - show detailed progress
 *
 * Shows additional information like file paths, timing data,
 * and step-by-step progress. Useful when users want more
 * visibility into what the CLI is doing.
 *
 * Respects config default: `quire settings set verbose true`
 * Conflicts with --quiet since quiet mode suppresses output.
 *
 * @type {Array}
 */
export const verboseOption = [
  '-v, --verbose', 'show detailed progress output',
  { conflicts: ['quiet'] }
]

/**
 * Progress option - hidden alias for --verbose
 *
 * Provides a familiar `--progress` flag as an alternative to `--verbose`.
 * Many users expect `--progress` to show detailed output during long-running
 * operations like builds and file deletions.
 *
 * Hidden from help output since --verbose is the canonical flag.
 * Uses `implies` to set verbose=true when --progress is used.
 *
 * @type {Array}
 */
const progressOption = [
  '--progress', 'show detailed progress (alias for --verbose)',
  { hidden: true, implies: { verbose: true } }
]

/**
 * Debug mode option - enable debug output
 *
 * Enables the DEBUG=quire:* namespace for internal logging.
 * Outputs technical debugging information intended for developers
 * and maintainers troubleshooting issues.
 *
 * Respects config default: `quire settings set debug true`
 * Conflicts with --quiet since quiet mode suppresses output.
 *
 * @type {Array}
 */
export const debugOption = [
  '--debug', 'enable debug output for troubleshooting',
  { conflicts: ['quiet'] }
]

/**
 * Reduced motion option - disable spinner animation and line overwriting
 *
 * When enabled, the reporter outputs static text on new lines instead of
 * animated spinners that overwrite the current line. This is useful for:
 * - Screen reader users (animated overwriting disrupts reading flow)
 * - Users who prefer reduced motion
 * - Environments where terminal animation is problematic
 *
 * Respects config default: `quire settings set reducedMotion true`
 * Also respects REDUCED_MOTION environment variable.
 *
 * @type {Array}
 */
export const reducedMotionOption = [
  '--reduced-motion', 'disable spinner animation and line overwriting',
]

/**
 * Standard output mode options (quiet, verbose, debug, progress)
 *
 * Most commands should include all three options for consistent UX.
 * Spread this array into your command's options:
 *
 * ```javascript
 * options: [
 *   ...outputModeOptions,
 *   ['--my-option', 'custom option'],
 * ]
 * ```
 *
 * @type {string[][]}
 */
export const outputModeOptions = [
  quietOption,
  verboseOption,
  progressOption,
  debugOption,
]

/**
 * Standard help text for output modes
 *
 * @type {string}
 */
export const outputModeHelpText = `Output Modes:
  -q, --quiet      Suppress progress output (for CI/scripts)
  -v, --verbose    Show detailed progress (paths, timing)
  --progress       Alias for --verbose
  --debug          Enable debug output for troubleshooting`

/**
 * Add output mode options to a command definition
 *
 * Injects --quiet, --verbose, --debug options and prepends the
 * standard output mode help text to the command's helpText.
 *
 * @param {Object} definition - Command definition object
 * @param {string} [definition.helpText] - Existing help text (output modes prepended)
 * @param {Array} [definition.options] - Existing options (output modes appended)
 * @returns {Object} Modified definition with output mode options
 *
 * @example
 * static definition = withOutputModes({
 *   name: 'build',
 *   description: 'Generate publication outputs',
 *   helpText: `
 * Examples:
 *   quire build --verbose
 * `,
 *   options: [
 *     ['--custom', 'my option'],
 *   ],
 * })
 */
export function withOutputModes(definition) {
  return {
    ...definition,
    helpText: definition.helpText
      ? `\n${outputModeHelpText}\n${definition.helpText}`
      : `\n${outputModeHelpText}`,
    options: [
      ...(definition.options || []),
      ...outputModeOptions,
    ],
  }
}
