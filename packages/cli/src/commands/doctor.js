import fs from 'node:fs'
import path from 'node:path'
import Command from '#src/Command.js'
import { withOutputModes } from '#lib/commander/index.js'
import { runAllChecksWithSections, checkSections, SECTION_NAMES, CHECK_IDS } from '#lib/doctor/index.js'
import { formatHuman } from '#lib/doctor/formatters/human.js'
import { formatJson } from '#lib/doctor/formatters/json.js'

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
  static definition = withOutputModes({
    name: 'doctor',
    aliases: ['checkup', 'check', 'diagnostic', 'health'],
    description: 'Diagnose common issues with your Quire setup',
    summary: 'check environment and project health',
    docsLink: 'quire-commands/#troubleshooting',
    helpText: `
Runs diagnostic checks organized into three sections:
  • Environment: os, cli, node, npm, git
  • Project: project, deps, 11ty, data
  • Outputs: build, pdf, epub

Examples:
  quire doctor                          Run all diagnostic checks
  quire doctor all                      Run all checks (same as no argument)
  quire doctor environment              Check environment section only
  quire doctor node                     Check Node.js version only
  quire doctor node git                 Check multiple items
  quire doctor --errors                 Show only failed checks
  quire doctor --warnings               Show only warnings
  quire doctor --verbose                Show additional details (paths, versions)
  quire doctor --json                   Output results as JSON (to stdout)
  quire doctor --json report.json       Save JSON results to file
  quire checkup                         Alias for doctor command

CI/Scripting:
  quire doctor --quiet                  Exit code only (0=success, 1=failure)
  quire doctor --quiet --json out.json  Save JSON report silently
`,
    version: '1.0.0',
    args: [
      [
        '[checks...]',
        `run specific check(s): all, ${SECTION_NAMES.join(', ')}, or ${CHECK_IDS.join(', ')}`,
      ],
    ],
    options: [
      ['-e, --errors', 'show only failed checks'],
      ['-w, --warnings', 'show only warnings'],
      ['--json [file]', 'output results as JSON (to standard out or a file)'],
    ],
  })

  constructor() {
    super(DoctorCommand.definition)
  }

  async action(checks, options, command) {
    this.debug('called with checks=%O options=%O', checks, options)

    // Parse variadic checks argument into sections and individual checks
    const filterOptions = { sections: null, checks: null }
    let label = 'diagnostic checks'

    if (checks.length > 0) {
      const values = checks.map((v) => v.toLowerCase())

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

    const sections = await runAllChecksWithSections(filterOptions)

    // JSON output mode (options.json is true for flag-only, or string for file path)
    if (options.json) {
      this.outputJson(sections, options)
      return
    }

    // Quiet mode without JSON: just exit with appropriate code
    if (options.quiet) {
      this.outputQuiet(sections)
      return
    }

    // Human-readable output
    this.outputHuman(sections, options, label)
  }

  /**
   * Quiet mode: no output, just exit code
   * @param {Array} sections - Check results organized by section
   */
  outputQuiet(sections) {
    const { exitCode } = formatJson(sections, {})
    if (exitCode !== 0) {
      process.exitCode = exitCode
    }
  }

  /**
   * Output results as JSON for programmatic consumption
   * @param {Array} sections - Check results organized by section
   * @param {Object} options - Command options (options.json is true or filename string)
   */
  outputJson(sections, options) {
    const { json, exitCode } = formatJson(sections, {
      errors: options.errors,
      warnings: options.warnings,
      verbose: options.verbose,
    })

    // Write to file (if string path provided) or stdout (if just --json flag)
    if (typeof options.json === 'string') {
      const outputPath = path.resolve(options.json)
      fs.writeFileSync(outputPath, json + '\n')
      if (!options.quiet) {
        this.logger.info(`Results written to ${outputPath}`)
      }
    } else if (!options.quiet) {
      // Write to stdout (bypassing logger formatting) unless quiet mode
      console.log(json)
    }

    // Set exit code if any checks failed
    if (exitCode !== 0) {
      process.exitCode = exitCode
    }
  }

  /**
   * Map log level to console method for direct output
   *
   * Nota bene: doctor output bypasses the logger to avoid the `[quire]`
   * prefix on every line. The formatter already handles its own formatting
   * (icons, indentation, section headers). Using console methods directly
   * routes output to the correct output stream (stdout for info, stderr for
   * warn/error) without logger prefix and level labels.
   */
  static #consoleMethods = {
    info: console.log,
    warn: console.warn,
    error: console.error,
  }

  /**
   * Output results in human-readable format
   * @param {Array} sections - Check results organized by section
   * @param {Object} options - Command options
   * @param {string} label - Description of checks being run
   */
  outputHuman(sections, options, label) {
    const { lines, summary, key, exitCode, isEmpty } = formatHuman(sections, {
      errors: options.errors,
      warnings: options.warnings,
      verbose: options.verbose,
      label,
    })

    // Handle case where filters excluded all results
    if (isEmpty) {
      for (const { text, level } of lines) {
        this.#log(level, text)
      }
      return
    }

    // Output all formatted lines routed by log level
    for (const { text, level } of lines) {
      this.#log(level, text)
    }

    // Output summary
    if (summary) {
      this.#log(summary.level, summary.text)
    }

    // Output symbol key
    if (key) {
      this.#log('info', '')
      this.#log(key.level, key.text)
    }

    // Set exit code if any checks failed
    if (exitCode !== 0) {
      process.exitCode = exitCode
    }
  }

  /**
   * Write a line to the console, routed by log level
   *
   * @param {string} level - Log level (info, warn, error)
   * @param {string} text - Text to output
   */
  #log(level, text) {
    const method = DoctorCommand.#consoleMethods[level] || console.log
    method(text)
  }
}
