import Command from '#src/Command.js'
import { runAllChecks } from '#lib/doctor/index.js'

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

    const results = await runAllChecks()
    let hasErrors = false

    // Display results
    for (const { name, ok, message, remediation, docsUrl } of results) {
      if (!ok) hasErrors = true

      const status = ok ? '✓' : '✗'
      const lines = [`${status} ${name}`]

      if (message) {
        lines.push(`  ${message}`)
      }

      // Show remediation guidance for failed checks
      if (!ok && remediation) {
        lines.push('')
        lines.push(`  How to fix:`)
        lines.push(`  ${remediation}`)
      }

      if (!ok && docsUrl) {
        lines.push('')
        lines.push(`  Documentation: ${docsUrl}`)
      }

      const output = lines.join('\n')
      if (ok) {
        this.logger.info(output)
      } else {
        this.logger.error(output)
      }
    }

    if (hasErrors) {
      this.logger.warn('\nSome checks failed. See above for details.')
    } else {
      this.logger.info('\nAll checks passed!')
    }
  }
}
