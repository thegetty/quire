import Command from '#src/Command.js'
import { withOutputModes } from '#lib/commander/index.js'
import { binPath } from '#src/packageConfig.js'
import fs from 'node:fs'
import path from 'node:path'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `info` Command
 *
 * Display version information for the current Quire project.
 * Shows the versions of quire-cli and quire-11ty that the project was
 * created with, plus the starter template version.
 *
 * With --debug, also shows the full filesystem path to the quire-cli
 * executable.
 *
 * For system environment information (OS, Node.js, npm, Git),
 * use the `quire doctor` command instead.
 *
 * @class      InfoCommand
 * @extends    {Command}
 */
export default class InfoCommand extends Command {
  static definition = withOutputModes({
    name: 'info',
    description: 'Display version information for the current project',
    summary: 'show project version information',
    docsLink: 'quire-commands/#get-help',
    helpText: `
Shows the versions used when this project was created:
  • quire-cli version that created the project
  • quire-11ty version installed in the project
  • starter template version (if available)

For system environment checks (OS, Node.js, npm, Git),
use 'quire doctor' instead.

Example:
  quire info           Show project versions
  quire info --debug   Include installation paths
  quire info --json    Output version information as JSON
  quire doctor         Check environment and project health
`,
    version: '1.0.0',
    options: [
      ['--json', 'output version information as JSON'],
    ],
  })

  constructor() {
    super(InfoCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    // Load filename from config with a default constraint if it doesn't exist
    const versionFileName = this.config.get('versionFile')
    let versionInfo = { cli: '<=1.0.0.rc-7' }

    try {
      const versionFileData = fs.readFileSync(versionFileName, { encoding: 'utf8' })
      versionInfo = JSON.parse(versionFileData)
    } catch (error) {
      this.logger.warn(
        `This project was generated with the quire-cli prior to version 1.0.0.rc-8. Updating the version file to the new format, though this project's version file will not contain specific starter version information.`
      )
      fs.writeFileSync(versionFileName, JSON.stringify(versionInfo))
    }

    const { name: projectDirectory } = path.parse(process.cwd())

    // Read quire-11ty version from project's package.json
    let quire11tyVersion = 'unknown'
    try {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
      quire11tyVersion = packageJson.version
    } catch {
      this.debug('Could not read package.json')
    }

    if (options.json) {
      const result = {
        project: {
          directory: projectDirectory,
          cli: versionInfo.cli,
          quire11ty: quire11tyVersion,
          starter: versionInfo.starter || null,
        },
      }
      console.log(JSON.stringify(result, null, 2))
      return
    }

    const lines = [
      `Project: ${projectDirectory}`,
      '',
      `  quire-cli    ${versionInfo.cli || 'unknown'}`,
      `  quire-11ty   ${quire11tyVersion}`,
    ]

    if (versionInfo.starter) {
      lines.push(`  starter      ${versionInfo.starter}`)
    }

    if (options.debug) {
      lines.push('')
      lines.push(this.resolveCliPath())
    }

    lines.push('')
    lines.push('Tip: Run \'quire doctor\' for system environment checks')

    this.logger.info(lines.join('\n'))
  }

  /**
   * Resolve the full filesystem path to the quire CLI executable
   * @returns {string} Formatted path line
   */
  resolveCliPath() {
    const resolved = binPath()
    return resolved
      ? `  quire-cli    ${resolved}`
      : '  quire-cli    not found in PATH'
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
