import Command from '#src/Command.js'
import { execaCommand } from 'execa'
import fs from 'node:fs'
import os from 'node:os'
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

  action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    } else {
      console.debug('[CLI] Command \'%s\' called', this.name())
    }

    const versions = [
      {
        name: 'quire-cli',
        get: async () => {
          const { stdout } = await execaCommand('quire --version')
          return stdout
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
          const { starter } = JSON.parse(fs.readFileSync('.quire'))
          return `${starter.path} ${starter.version}`
        }
      },
      {
        debug: true,
        name: 'os',
        get: () => `${os.type()} ${os.release()}`,
      },
      {
        debug: true,
        name: 'node',
        get: () => process.version
      },
      {
        debug: true,
        name: 'npm',
        get: async () => {
          const { stdout } = await execaCommand('npm --version')
          return stdout
        }
      }
    ]
    versions
      .filter(({ debug }) => !debug || options.debug && debug)
      .forEach(async ({ name, get }) => console.info(`${name} ${await get()}`))
  }

  preAction(command) {
    testcwd(command)
  }
}
