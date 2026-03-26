import util from 'node:util'
import debug from 'debug'

/**
 * Debug utility for internal developer debugging
 *
 * Creates debug instances with the `quire:` namespace prefix.
 * Uses the standard `debug` package for namespace-based filtering.
 *
 * Object formatting:
 *   %O  Pretty-printed, indented on a new line (multi-line)
 *   %o  Compact single-line output (built-in default)
 *
 * @example
 * // In a module (short alias)
 * import createDebug from '#debug'
 * const debug = createDebug('lib:pdf')
 * debug('processing file: %s', filename)
 *
 * @example
 * // Enable via DEBUG environment variable
 * DEBUG=quire:lib:pdf quire pdf           # Single namespace
 * DEBUG=quire:lib:* quire build           # Wildcard matching
 * DEBUG=quire:* quire build               # All quire debug output
 * DEBUG=quire:*,Eleventy:* quire build    # Combined with Eleventy
 *
 * @see https://www.npmjs.com/package/debug
 */

/**
 * Override %O formatter to produce indented multi-line output
 *
 * Pretty-prints objects with each line indented by 2 spaces,
 * starting on a new line after the label.
 *
 * Use %o (lowercase) for compact single-line output.
 */
debug.formatters.O = function (value) {
  this.inspectOpts.colors = this.useColors
  const string = util.inspect(value, this.inspectOpts)
  return '\n' + string.split('\n').map((line) => '  ' + line).join('\n')
}

/**
 * Override formatArgs to prevent per-line namespace prefixing
 *
 * The default debug formatArgs (in color mode) splits the formatted
 * message on newlines and inserts the namespace prefix before every
 * line. This makes multi-line %O output noisy. This override only
 * prefixes the first line, letting continuation lines flow cleanly.
 */
const originalFormatArgs = debug.formatArgs
debug.formatArgs = function (args) {
  if (this.useColors) {
    const c = this.color
    const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c)
    const prefix = `  ${colorCode};1m${this.namespace} \u001B[0m`

    args[0] = prefix + args[0]
    args.push(colorCode + 'm+' + debug.humanize(this.diff) + '\u001B[0m')
  } else {
    originalFormatArgs.call(this, args)
  }
}

/**
 * Root namespace for all Quire CLI debug output
 */
export const DEBUG_NAMESPACE = 'quire'

/**
 * Create a debug instance with the quire namespace prefix
 *
 * @param {string} namespace - Module namespace (e.g., 'lib:pdf', 'commands:build')
 * @returns {debug.Debugger} Debug instance
 *
 * @example
 * const debug = createDebug('lib:pdf:paged')
 * debug('printer options: %O', options)
 * // Output (when DEBUG=quire:lib:pdf:paged):
 * // quire:lib:pdf:paged printer options:
 * //   { format: 'A4', landscape: false } +0ms
 */
export default function createDebug(namespace) {
  return debug(`${DEBUG_NAMESPACE}:${namespace}`)
}

/**
 * Create a debug instance without the quire prefix
 * Useful for debugging external libraries or special cases
 *
 * @param {string} namespace - Full namespace
 * @returns {debug.Debugger} Debug instance
 */
export function createRawDebug(namespace) {
  return debug(namespace)
}

/**
 * Enable debug output for specific namespaces programmatically
 *
 * @param {string} namespaces - Comma-separated namespaces (supports wildcards)
 *
 * @example
 * enableDebug('quire:lib:*')
 * enableDebug('quire:*,Eleventy:*')
 */
export function enableDebug(namespaces) {
  debug.enable(namespaces)
}

/**
 * Disable all debug output
 */
export function disableDebug() {
  debug.disable()
}

/**
 * Check if debug output is enabled for a namespace
 *
 * @param {string} namespace - Namespace to check (without quire: prefix)
 * @returns {boolean} True if debug output would be shown
 *
 * @example
 * if (isDebugEnabled('lib:pdf')) {
 *   // Expensive debug-only computation
 * }
 */
export function isDebugEnabled(namespace) {
  return debug.enabled(`${DEBUG_NAMESPACE}:${namespace}`)
}
