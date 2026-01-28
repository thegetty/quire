/**
 * Shared utilities for doctor output formatters
 *
 * @module lib/doctor/formatters/shared
 */
import chalk from 'chalk'

/**
 * Default terminal width when stdout is not a TTY (piped/redirected)
 * @type {number}
 */
const DEFAULT_COLUMNS = 80

/**
 * Get the current terminal width
 *
 * Falls back to DEFAULT_COLUMNS when stdout is not a TTY
 * (e.g., piped to a file or another process).
 *
 * @returns {number} Terminal width in columns
 */
export function getTerminalWidth() {
  return process.stdout.columns || DEFAULT_COLUMNS
}

/**
 * Status types for check results
 * @typedef {'passed'|'failed'|'warning'|'timeout'|'na'} CheckStatus
 */

/**
 * Colored status icons for check results (for terminal output)
 */
export const STATUS_ICONS = {
  passed: chalk.green('✓'),
  failed: chalk.red('✗'),
  warning: chalk.yellow('⚠'),
  timeout: chalk.magenta('⏱'),
  na: chalk.gray('○'),
}

/**
 * Determine the status string for a check result
 * @param {Object} result - Check result with ok and level properties
 * @returns {CheckStatus}
 */
export function getStatus(result) {
  if (result.level === 'na') return 'na'
  if (result.level === 'timeout') return 'timeout'
  if (result.ok) return 'passed'
  if (result.level === 'warn') return 'warning'
  return 'failed'
}

/**
 * Count results by status
 * @param {Array} sections - Check results organized by section
 * @param {Object} [options] - Filter options
 * @param {boolean} [options.errors] - Only count failed checks
 * @param {boolean} [options.warnings] - Only count warning checks
 * @returns {{passed: number, failed: number, warnings: number, timeouts: number, na: number, total: number}}
 */
export function countResults(sections, options = {}) {
  let passed = 0
  let failed = 0
  let warnings = 0
  let timeouts = 0
  let na = 0

  for (const { results } of sections) {
    for (const result of results) {
      const status = getStatus(result)

      // Apply filters
      if (options.errors && options.warnings) {
        if (status !== 'failed' && status !== 'warning') continue
      } else {
        if (options.errors && status !== 'failed') continue
        if (options.warnings && status !== 'warning') continue
      }

      // Count by status
      if (status === 'passed') passed++
      else if (status === 'failed') failed++
      else if (status === 'warning') warnings++
      else if (status === 'timeout') timeouts++
      else if (status === 'na') na++
    }
  }

  return {
    passed,
    failed,
    warnings,
    timeouts,
    na,
    total: passed + failed + warnings + timeouts + na,
  }
}

/**
 * Filter results based on options
 * @param {Array} sections - Check results organized by section
 * @param {Object} [options] - Filter options
 * @param {boolean} [options.errors] - Only include failed checks
 * @param {boolean} [options.warnings] - Only include warning checks
 * @returns {Array} Filtered sections (only sections with results after filtering)
 */
export function filterResults(sections, options = {}) {
  const filtered = []

  for (const { section, results } of sections) {
    const filteredResults = results.filter((result) => {
      const status = getStatus(result)
      if (options.errors && options.warnings) {
        return status === 'failed' || status === 'warning'
      }
      if (options.errors && status !== 'failed') return false
      if (options.warnings && status !== 'warning') return false
      return true
    })

    if (filteredResults.length > 0) {
      filtered.push({ section, results: filteredResults })
    }
  }

  return filtered
}
