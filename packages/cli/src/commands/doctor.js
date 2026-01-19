import Command from '#src/Command.js'
import { runAllChecksWithSections } from '#lib/doctor/index.js'

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
Examples:
  quire doctor           Run all diagnostic checks
  quire checkup          Alias for doctor command
`,
    version: '1.0.0',
    options: [],
  }

  constructor() {
    super(DoctorCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    this.logger.info('Running diagnostic checks...\n')

    const sections = await runAllChecksWithSections()
    let hasErrors = false
    let hasWarnings = false

    // Display results by section
    for (const { section, results } of sections) {
      this.logger.info(`${section}`)

      for (const { name, ok, level, message, remediation, docsUrl } of results) {
        if (!ok) {
          if (level === 'warn') {
            hasWarnings = true
          } else {
            hasErrors = true
          }
        }

        const status = ok ? '✓' : level === 'warn' ? '⚠' : '✗'
        const lines = [`  ${status} ${name}`]

        if (message) {
          lines.push(`    ${message}`)
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

    if (hasErrors) {
      this.logger.error('Some checks failed. See above for details.')
    } else if (hasWarnings) {
      this.logger.warn('All checks passed with warnings.')
    } else {
      this.logger.info('All checks passed!')
    }
  }
}
