import Command from '#src/Command.js'
import { execaCommand } from 'execa'
import fs from 'node:fs'
import os from 'node:os'
import testcwd from '#helpers/test-cwd.js'

const VERSION_FILE = '.quire'

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
    summary: 'list info',
    version: '1.0.0',
    args: [],
    options: [['--debug', 'include os versions in output']],
  }

  constructor() {
    super(InfoCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug(
        '[CLI] Command \'%s\' called with options %o',
        this.name(),
        options
      )
    } else {
      console.debug('[CLI] Command \'%s\' called', this.name())
    }

    let versionFile = fs.readFileSync(VERSION_FILE, { encoding: 'utf8' })
    try {
      versionFile = JSON.parse(versionFile)
    } catch (error) {
      console.warn(
        `This project was generated with quire-cli prior to version 1.0.0.rc-8, the quire version file does not contain specific version information.`
      )
      fs.writeFileSync(VERSION_FILE, JSON.stringify({}))
    }

    const versions = [
      {
        title: '[Project]',
        items: [
          {
            name: 'quire-cli',
            get: () => versionFile.cli,
          },
          {
            name: 'quire-11ty',
            get: () => {
              const { version } = JSON.parse(fs.readFileSync('./package.json'))
              return version
            },
          },
          {
            name: 'starter',
            get: () =>  versionFile.starter,
          },
        ],
      },
      {
        title: '[Operating System]',
        debug: true,
        items: [
          {
            name: os.type(),
            get: () => os.release(),
          },
        ],
      },
      {
        title: '[Node]',
        debug: true,
        items: [
          {
            name: 'node',
            get: () => process.version,
          },
          {
            name: 'npm',
            get: async () => {
              const { stdout } = await execaCommand('npm --version')
              return stdout
            },
          },
        ],
      },
      {
        title: '[Local Quire Version]',
        items: [
          {
            name: 'quire-cli',
            get: async () => {
              const { stdout } = await execaCommand('quire --version')
              return stdout
            },
          },
        ],
      },
    ]

    /**
     * Filter the command output based on `debug` settings
     */
    versions
      .filter(({ debug }) => !debug || (options.debug && debug))
      .forEach(async ({ items, title }) => {
        const versions = await Promise.all(
          items.map(async ({ name, get }) => `${name} ${await get()}`)
        )
        console.info(`${title}\n ${versions.join('\n ')}`)
      })
  }

  preAction(command) {
    testcwd(command)
  }
}
