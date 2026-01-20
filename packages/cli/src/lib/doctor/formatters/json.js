/**
 * JSON formatter for doctor check results
 *
 * Formats check results as machine-readable JSON for programmatic consumption.
 *
 * @module lib/doctor/formatters/json
 */
import { getStatus, countResults, filterResults } from './shared.js'

/**
 * Format check results as JSON
 *
 * @param {Array} sections - Check results organized by section
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.errors] - Only include failed checks
 * @param {boolean} [options.warnings] - Only include warning checks
 * @param {boolean} [options.verbose] - Include additional details
 * @returns {{json: string, exitCode: number}} Formatted JSON string and exit code
 *
 * @example
 * const { json, exitCode } = formatJson(sections, { verbose: true })
 * console.log(json)
 * process.exit(exitCode)
 */
export function formatJson(sections, options = {}) {
  const filteredSections = filterResults(sections, options)
  const counts = countResults(filteredSections)
  const allChecks = []

  for (const { section, results } of filteredSections) {
    for (const result of results) {
      const status = getStatus(result)

      // Build check object
      const check = {
        id: result.id,
        name: result.name,
        section,
        status,
        message: result.message || null,
      }

      // Include verbose details if requested
      if (options.verbose && result.details) {
        check.details = result.details
      }

      // Include remediation for failed/warning/timeout checks
      if (!result.ok && result.remediation) {
        check.remediation = result.remediation
      }

      if (!result.ok && result.docsUrl) {
        check.docsUrl = result.docsUrl
      }

      allChecks.push(check)
    }
  }

  const output = {
    summary: counts,
    checks: allChecks,
  }

  return {
    json: JSON.stringify(output, null, 2),
    exitCode: counts.failed > 0 ? 1 : 0,
  }
}

export default formatJson
