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
    for (const { name, ok, message } of results) {
      if (!ok) hasErrors = true

      const status = ok ? '✓' : '✗'
      const line = `${status} ${name}`

      if (ok) {
        this.logger.info(line)
      } else {
        this.logger.error(line)
      }

      if (message) {
        this.logger.info(`  ${message}`)
      }
    }

    this.logger.info('')
    if (hasErrors) {
      this.logger.warn('Some checks failed. See above for details.')
    } else {
      this.logger.info('All checks passed!')
    }
  }
}
