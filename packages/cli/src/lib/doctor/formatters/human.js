/**
 * Human-readable formatter for doctor check results
 *
 * Formats check results for terminal display with colors and icons.
 *
 * @module lib/doctor/formatters/human
 */
import { getStatus, STATUS_ICONS, filterResults } from './shared.js'

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
 * Format a single check result for human display
 *
 * @param {Object} result - Check result
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.verbose] - Include additional details
 * @returns {FormattedLine}
 */
function formatCheck(result, options = {}) {
  const { name, ok, level, message, details, remediation, docsUrl } = result
  const status = getStatus(result)
  const statusIcon = STATUS_ICONS[status]

  const statusLine = message ? `  ${statusIcon} ${name}: ${message}` : `  ${statusIcon} ${name}`
  const lines = [statusLine]

  // Show details when verbose is enabled
  if (options.verbose && details) {
    lines.push(`      ${details}`)
  }

  // Show remediation guidance for failed/timeout checks
  if (!ok && remediation) {
    lines.push('')
    lines.push(`    How to fix:`)
    lines.push(`    ${remediation}`)
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
 * Format check results for human-readable display
 *
 * @param {Array} sections - Check results organized by section
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.errors] - Only include failed checks
 * @param {boolean} [options.warnings] - Only include warning checks
 * @param {boolean} [options.verbose] - Include additional details
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
  const { label = 'diagnostic checks', verbose = false } = options
  const filteredSections = filterResults(sections, options)

  const lines = []
  let errorCount = 0
  let warningCount = 0
  let timeoutCount = 0
  let displayedCount = 0

  // Header
  lines.push({ text: `Running ${label}...\n`, level: 'info' })

  // Process each section
  for (const { section, results } of filteredSections) {
    // Section header
    lines.push({ text: section, level: 'info' })

    let lastSubsection = null
    for (const result of results) {
      displayedCount++

      // Insert subsection label when entering a new subsection
      if (result.subsection && result.subsection !== lastSubsection) {
        lines.push({ text: `  ── ${result.subsection} ──`, level: 'info' })
      }
      lastSubsection = result.subsection || null

      // Count errors, warnings, and timeouts (N/A checks are not counted)
      if (!result.ok && result.level !== 'na') {
        if (result.level === 'warn') {
          warningCount++
        } else if (result.level === 'timeout') {
          timeoutCount++
        } else {
          errorCount++
        }
      }

      lines.push(formatCheck(result, { verbose }))
    }

    // Blank line between sections
    lines.push({ text: '', level: 'info' })
  }

  // Handle case where filters excluded all results
  if (displayedCount === 0) {
    let emptyMessage = null
    if (options.errors) {
      emptyMessage = 'No failed checks found.'
    } else if (options.warnings) {
      emptyMessage = 'No warnings found.'
    }

    return {
      lines: emptyMessage ? [{ text: emptyMessage, level: 'info' }] : [],
      summary: null,
      key: null,
      exitCode: 0,
      isEmpty: true,
    }
  }

  // Build summary
  let summary = null
  let exitCode = 0

  if (errorCount > 0) {
    const errorText = errorCount === 1 ? '1 check failed' : `${errorCount} checks failed`
    const extras = []
    if (warningCount > 0) extras.push(warningCount === 1 ? '1 warning' : `${warningCount} warnings`)
    if (timeoutCount > 0) extras.push(timeoutCount === 1 ? '1 timed out' : `${timeoutCount} timed out`)
    const extrasText = extras.length > 0 ? `, ${extras.join(', ')}` : ''
    summary = { text: `${errorText}${extrasText}. See above for details.`, level: 'error' }
    exitCode = 1
  } else if (warningCount > 0 || timeoutCount > 0) {
    const parts = []
    if (warningCount > 0) parts.push(warningCount === 1 ? '1 warning' : `${warningCount} warnings`)
    if (timeoutCount > 0) parts.push(timeoutCount === 1 ? '1 timed out' : `${timeoutCount} timed out`)
    summary = { text: `All checks passed with ${parts.join(', ')}.`, level: 'warn' }
  } else if (!options.errors && !options.warnings) {
    summary = { text: 'All checks passed!', level: 'info' }
  }

  // Build key
  const key = {
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
