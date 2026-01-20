import Command from '#src/Command.js'
import { runAllChecksWithSections, checkSections, SECTION_NAMES, CHECK_IDS } from '#lib/doctor/index.js'

/**
 * Map section name to its check IDs
 */
const SECTION_CHECK_MAP = Object.fromEntries(
  checkSections.map((s) => [s.name.toLowerCase(), s.checks.map((c) => c.id)])
)

/**
 * Quire CLI `doctor` Command
 *
 * Diagnose common issues with the Quire environment and project setup.
 *
 * @class      DoctorCommand
 * @extends    {Command}
 */
export default class DoctorCommand extends Command {
  static definition = {
    name: 'doctor',
    aliases: ['checkup', 'diagnostic', 'health'],
    description: 'Diagnose common issues with your Quire setup',
    summary: 'check environment and project health',
    docsLink: 'quire-commands/#troubleshooting',
    helpText: `
Runs diagnostic checks organized into three sections:
  • Environment: os, cli, node, npm, git
  • Project: project, deps, 11ty, data
  • Outputs: build, pdf, epub

Examples:
  quire doctor                       Run all diagnostic checks
  quire doctor --check all           Run all checks (same as no flag)
  quire doctor --check environment   Check environment section only
  quire doctor --check node          Check Node.js version only
  quire doctor --check "node git"    Check multiple items (space-separated)
  quire doctor --check node,git      Check multiple items (comma-separated)
  quire checkup                      Alias for doctor command
`,
    version: '1.0.0',
    options: [
      [
        '-c, --check <ids>',
        `run specific check(s): all, ${SECTION_NAMES.join(', ')}, or ${CHECK_IDS.join(', ')}`,
      ],
      ['-v, --verbose', 'show additional details (paths, versions)'],
    ],
  }

  constructor() {
    super(DoctorCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    // Parse --check option into sections and individual checks
    const filterOptions = { sections: null, checks: null }
    let label = 'diagnostic checks'

    if (options.check) {
      // Accept comma or space-separated values
      const values = options.check.split(/[\s,]+/).map((v) => v.trim().toLowerCase()).filter(Boolean)

      // "all" means no filtering
      if (!values.includes('all')) {
        // Separate section names from individual check IDs
        const sectionValues = values.filter((v) => SECTION_NAMES.includes(v))
        const checkValues = values.filter((v) => CHECK_IDS.includes(v))

        // If we have section names, use them as section filter
        if (sectionValues.length > 0 && checkValues.length === 0) {
          filterOptions.sections = sectionValues
          label = sectionValues.length === 1
            ? `${sectionValues[0]} checks`
            : `${sectionValues.join(', ')} checks`
        } else if (checkValues.length > 0) {
          // If we have individual checks (with or without sections),
          // expand sections to their check IDs and combine
          const expandedChecks = new Set(checkValues)
          for (const section of sectionValues) {
            const sectionCheckIds = SECTION_CHECK_MAP[section] || []
            sectionCheckIds.forEach((id) => expandedChecks.add(id))
          }
          filterOptions.checks = [...expandedChecks]
          label = filterOptions.checks.length === 1
            ? `${filterOptions.checks[0]} check`
            : `${filterOptions.checks.join(', ')} checks`
        }
      }
    }

    this.logger.info(`Running ${label}...\n`)

    const sections = await runAllChecksWithSections(filterOptions)
    let errorCount = 0
    let warningCount = 0

    // Display results by section
    for (const { section, results } of sections) {
      this.logger.info(`${section}`)

      for (const { name, ok, level, message, details, remediation, docsUrl } of results) {
        if (!ok) {
          if (level === 'warn') {
            warningCount++
          } else {
            errorCount++
          }
        }

        const status = ok ? '✓' : level === 'warn' ? '⚠' : '✗'
        const statusLine = message ? `  ${status} ${name}: ${message}` : `  ${status} ${name}`
        const lines = [statusLine]

        // Show details when --verbose is enabled
        if (options.verbose && details) {
          lines.push(`      ${details}`)
        }

        // Show remediation guidance for failed checks
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

        const output = lines.join('\n')
        if (ok) {
          this.logger.info(output)
        } else if (level === 'warn') {
          this.logger.warn(output)
        } else {
          this.logger.error(output)
        }
      }

      this.logger.info('') // Blank line between sections
    }

    if (errorCount > 0) {
      const errorText = errorCount === 1 ? '1 check failed' : `${errorCount} checks failed`
      if (warningCount > 0) {
        const warningText = warningCount === 1 ? '1 warning' : `${warningCount} warnings`
        this.logger.error(`${errorText}, ${warningText}. See above for details.`)
      } else {
        this.logger.error(`${errorText}. See above for details.`)
      }
      process.exit(1)
    } else if (warningCount > 0) {
      const warningText = warningCount === 1 ? '1 warning' : `${warningCount} warnings`
      this.logger.warn(`All checks passed with ${warningText}.`)
    } else {
      this.logger.info('All checks passed!')
    }
  }
}
