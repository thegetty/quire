import Command from '#src/Command.js'
import npm from '#lib/npm/index.js'
import { execa } from 'execa'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `info` Command
 *
 * Runs the Eleventy `info` command to list the quire-cli, quire-11ty, node, and npm versions.
 *
 * @class      InfoCommand
 * @extends    {Command}
 */
export default class InfoCommand extends Command {
  static definition = {
    name: 'info',
    description: 'List Quire cli, quire-11ty, and node versions',
    summary: 'show version information',
    docsLink: 'quire-commands/#get-help',
    helpText: `
Examples:
  quire info              Show project and system CLI versions
  quire info --debug      Include node, npm, and OS versions
  quire info --json       Output version information as JSON
`,
    version: '1.0.0',
    options: [
      ['--json', 'output version information as JSON'],
      ['--debug', 'include os versions in output'],
    ],
  }

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

    // Read quire-11ty version from package.json
    const { version: quire11tyVersion } = JSON.parse(fs.readFileSync('./package.json'))

    // Get system CLI version
    const { stdout: systemCliVersion } = await execa('quire', ['--version'])

    /**
     * JSON output includes all version data regardless of --debug flag
     * to provide a stable schema for automation and scripting.
     */
    if (options.json) {
      const result = {
        project: {
          directory: projectDirectory,
          cli: versionInfo.cli,
          quire11ty: quire11tyVersion,
          starter: versionInfo.starter,
        },
        system: {
          cli: systemCliVersion,
          node: process.version,
          npm: await npm.version(),
          os: `${os.type()} ${os.release()}`,
        },
      }
      console.log(JSON.stringify(result, null, 2))
      return
    }

    const versions = [
      {
        title: `[${projectDirectory}]`,
        items: [
          {
            name: 'quire-cli',
            get: () => versionInfo.cli,
          },
          {
            name: 'quire-11ty',
            get: () => quire11tyVersion,
          },
          {
            name: 'starter',
            get: () => versionInfo.starter,
          },
        ],
      },
      {
        title: '[System]',
        items: [
          {
            name: 'quire-cli',
            get: () => systemCliVersion,
          },
          {
            debug: true,
            name: 'node',
            get: () => process.version,
          },
          {
            debug: true,
            name: 'npm',
            get: async () => await npm.version(),
          },
          {
            debug: true,
            name: 'os',
            get: () => `${os.type()} ${os.release()}`,
          },
        ],
      },
    ]

    /**
     * Filter the command output based on `debug` settings
     */
    for (const { items, title } of versions) {
      const versionList = await Promise.all(
        items
          .filter(({ debug }) => !debug || (options.debug && debug))
          .map(async ({ name, get }) => `${name} ${await get()}`)
      )
      this.logger.info(`${title}\n ${versionList.join('\n ')}`)
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
