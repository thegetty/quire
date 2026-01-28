/**
 * Human-readable formatter for doctor check results
 *
 * Formats check results for terminal display with colors and icons.
 *
 * @module lib/doctor/formatters/human
 */
import wrapAnsi from 'wrap-ansi'
import {
  STATUS_ICONS,
  countResults,
  filterResults,
  getStatus,
  getTerminalWidth
} from './shared.js'

/**
 * Log level for output routing
 * @typedef {'info'|'warn'|'error'} LogLevel
 */

/**
 * Formatted line with routing information
 * @typedef {Object} FormattedLine
 * @property {string} text - The formatted text to display
 * @property {LogLevel} level - The log level for routing (info, warn, error)
 */

/**
 * Wrap text to fit within the terminal, preserving indentation
 *
 * Each line in the input is indented by `indent` spaces. The text is
 * wrapped so that the total line width (indent + content) does not
 * exceed the terminal width. Continuation lines receive the same indent.
 *
 * @param {string} text - Text to wrap (may contain newlines)
 * @param {number} indent - Number of leading spaces for each line
 * @param {number} columns - Terminal width in columns
 * @returns {string} Wrapped and indented text
 */
function wrapIndented(text, indent, columns) {
  const prefix = ' '.repeat(indent)
  const contentWidth = Math.max(columns - indent, 20)

  return text
    .split('\n')
    .map((line) => {
      const wrapped = wrapAnsi(line, contentWidth, { hard: true, trim: false })
      return wrapped
        .split('\n')
        .map((wl) => `${prefix}${wl}`)
        .join('\n')
    })
    .join('\n')
}

/**
 * Format a single check result for human display
 *
 * @param {Object} result - Check result
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.verbose] - Include additional details
 * @param {number} [options.columns] - Terminal width in columns
 * @returns {FormattedLine}
 */
function formatCheck(result, options = {}) {
  const { name, ok, level, message, details, remediation, docsUrl } = result
  const status = getStatus(result)
  const statusIcon = STATUS_ICONS[status]
  const columns = options.columns || getTerminalWidth()

  const statusLine = message ? `  ${statusIcon} ${name}: ${message}` : `  ${statusIcon} ${name}`
  const lines = [statusLine]

  // Show details when verbose is enabled
  if (options.verbose && details) {
    lines.push(wrapIndented(details, 6, columns))
  }

  // Show remediation guidance for failed/timeout checks
  if (!ok && remediation) {
    lines.push('')
    lines.push(`    How to fix:`)
    lines.push(wrapIndented(remediation, 4, columns))
  }

  if (!ok && docsUrl) {
    lines.push('')
    lines.push(`    Documentation: ${docsUrl}`)
    lines.push('')
  }

  // Determine log level for routing
  let logLevel = 'info'
  if (!ok && level !== 'na') {
    if (level === 'warn' || level === 'timeout') {
      logLevel = 'warn'
    } else {
      logLevel = 'error'
    }
  }

  return {
    text: lines.join('\n'),
    level: logLevel,
  }
}

/**
 * Build summary text and exit code from unfiltered section counts
 *
 * @param {Array} sections - Unfiltered check results organized by section
 * @returns {{summary: FormattedLine, exitCode: number}}
 */
function buildSummary(sections) {
  const counts = countResults(sections)
  const naSuffix = counts.na > 0
    ? ` (${counts.na} not applicable)`
    : ''

  let summary
  let exitCode = 0

  if (counts.failed > 0) {
    const errorText = counts.failed === 1 ? '1 check failed' : `${counts.failed} checks failed`
    const extras = []
    if (counts.warnings > 0) extras.push(counts.warnings === 1 ? '1 warning' : `${counts.warnings} warnings`)
    if (counts.timeouts > 0) extras.push(counts.timeouts === 1 ? '1 timed out' : `${counts.timeouts} timed out`)
    const extrasText = extras.length > 0 ? `, ${extras.join(', ')}` : ''
    summary = { text: `${errorText}${extrasText}. See above for details.${naSuffix}`, level: 'error' }
    exitCode = 1
  } else if (counts.warnings > 0 || counts.timeouts > 0) {
    const parts = []
    if (counts.warnings > 0) parts.push(counts.warnings === 1 ? '1 warning' : `${counts.warnings} warnings`)
    if (counts.timeouts > 0) parts.push(counts.timeouts === 1 ? '1 timed out' : `${counts.timeouts} timed out`)
    summary = { text: `All checks passed with ${parts.join(', ')}.${naSuffix}`, level: 'warn' }
  } else {
    summary = { text: `All checks passed!${naSuffix}`, level: 'info' }
  }

  return { summary, exitCode }
}

/**
 * Format check results for human-readable display
 *
 * @param {Array} sections - Check results organized by section
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.errors] - Only include failed checks
 * @param {boolean} [options.warnings] - Only include warning checks
 * @param {boolean} [options.verbose] - Include additional details
 * @param {number} [options.columns] - Terminal width override (default: auto-detected)
 * @param {string} [options.label='diagnostic checks'] - Description of checks being run
 * @returns {{lines: FormattedLine[], summary: FormattedLine|null, key: FormattedLine|null, exitCode: number, isEmpty: boolean}}
 *
 * @example
 * const { lines, summary, key, exitCode } = formatHuman(sections, { verbose: true })
 * for (const { text, level } of lines) {
 *   logger[level](text)
 * }
 * if (summary) logger[summary.level](summary.text)
 */
export function formatHuman(sections, options = {}) {
  const { label = 'diagnostic checks', verbose = false, columns } = options
  const terminalColumns = columns || getTerminalWidth()
  const filteredSections = filterResults(sections, options)

  const lines = []
  let errorCount = 0
  let warningCount = 0
  let timeoutCount = 0
  let naCount = 0
  let displayedCount = 0

  // Header (append filter description when active)
  let filterSuffix = ''
  if (options.errors && options.warnings) {
    filterSuffix = ' (warnings and errors only)'
  } else if (options.errors) {
    filterSuffix = ' (errors only)'
  } else if (options.warnings) {
    filterSuffix = ' (warnings only)'
  }
  lines.push({ text: `Running ${label}${filterSuffix}...\n`, level: 'info' })

  // Process each section
  for (const { section, results } of filteredSections) {
    // Section header
    lines.push({ text: section, level: 'info' })

    for (const result of results) {
      displayedCount++

      // Count by status category
      if (result.level === 'na') {
        naCount++
      } else if (!result.ok) {
        if (result.level === 'warn') {
          warningCount++
        } else if (result.level === 'timeout') {
          timeoutCount++
        } else {
          errorCount++
        }
      }

      lines.push(formatCheck(result, { verbose, columns: terminalColumns }))
    }

    // Blank line between sections
    lines.push({ text: '', level: 'info' })
  }

  // Handle case where filters excluded all results
  if (displayedCount === 0) {
    let emptyMessage = null
    if (options.errors && options.warnings) {
      emptyMessage = 'No failed checks or warnings found.'
    } else if (options.errors) {
      emptyMessage = 'No failed checks found.'
    } else if (options.warnings) {
      emptyMessage = 'No warnings found.'
    }

    // Even when the filter shows nothing, summary and exitCode reflect unfiltered status
    const { summary, exitCode } = buildSummary(sections)
    return {
      lines: emptyMessage ? [{ text: emptyMessage, level: 'info' }] : [],
      summary,
      key: null,
      exitCode,
      isEmpty: true,
    }
  }

  // Build summary from unfiltered counts so filters don't hide the overall status
  const { summary, exitCode } = buildSummary(sections)

  // Build key (hidden when filtering to --errors or --warnings only)
  const key = (options.errors || options.warnings)
    ? null
    : {
        text: `Key: ${STATUS_ICONS.passed} passed  ${STATUS_ICONS.failed} failed  ${STATUS_ICONS.warning} warning  ${STATUS_ICONS.timeout} timed out  ${STATUS_ICONS.na} not applicable / not yet generated`,
        level: 'info',
      }

  return {
    lines,
    summary,
    key,
    exitCode,
    isEmpty: false,
  }
}

export default formatHuman
