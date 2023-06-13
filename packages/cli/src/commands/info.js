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
    options: [
      [ '--debug', 'include os versions in output' ],
    ],
  }

  constructor() {
    super(InfoCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    } else {
      console.debug('[CLI] Command \'%s\' called', this.name())
    }

    let versionFile = {}
    try {
      versionFile = JSON.parse(fs.readFileSync(VERSION_FILE))
    } catch (error) {
      console.warn(
        `This project was generated with quire-cli version < 1.0.0.rc-8 so we cannot determine which cli or starter version was used to create it.`
      )
    }

    const versions = [
      {
        title: '[Project]',
        items: [
          {
            name: 'quire-cli',
            get: () => {
              const { cli } = versionFile
              return cli ? `${cli}` : 'unknown'
            }
          },
          {
            name: 'quire-11ty',
            get: () => {
              const { version } = JSON.parse(fs.readFileSync('./package.json'))
              return version
            }
          },
          {
            name: 'starter',
            get: () => {
              const { starter } = versionFile
              return starter ? `${starter.path} ${starter.version}` : 'unknown'
            }
          },
        ]
      },
      {
        title: '[Operating System]',
        debug: true,
        items: [
          {
            name: os.type(),
            get: () => os.release(),
          }
        ]
      },
      {
        title: '[Node]',
        debug: true,
        items: [
          {
            name: 'node',
            get: () => process.version
          },
          {
            name: 'npm',
            get: async () => {
              const { stdout } = await execaCommand('npm --version')
              return stdout
            }
          }
        ]
      },
      {
        title: '[Local Quire Version]',
        items: [
          {
            name: 'quire-cli',
            get: async () => {
              const { stdout } = await execaCommand('quire --version')
              return stdout
            }
          }
        ]
      }
    ]

    /**
     * Filter the command output based on `debug` settings
     */
    versions
      .filter(({ debug }) => !debug || options.debug && debug)
      .forEach(async (item) => {
        const versions = await Promise.all(
          item.items.map(
            async ({ name, get }) => {
              const version = await get()
              return `${name} ${version}`
            }
          )
        )
        console.info(item.title)
        console.info(` ${versions.join('\n ')}`)
      })
  }

  preAction(command) {
    testcwd(command)
  }
}
