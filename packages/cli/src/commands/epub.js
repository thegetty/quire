import Command from '#src/Command.js'
import { paths, projectRoot  } from '#lib/11ty/index.js'
import fs from 'fs-extra'
import libEpub from '#lib/epub/index.js'
import open from 'open'
import path from 'node:path'

/**
 * Quire CLI `build epub` Command
 *
 * Generate EPUB from Eleventy `build` output.
 *
 * @class      EpubCommand
 * @extends    {Command}
 */
export default class EpubCommand extends Command {
  static definition = {
    name: 'epub',
    description: 'Generate publication EPUB',
    summary: 'run build epub',
    version: '1.0.0',
    args: [],
    options: [
      [
        '--lib <module>', 'use the specified epub library', 'epubjs',
        { choices: ['epubjs', 'pandoc'], default: 'epubjs' }
      ],
      [ '--open', 'open EPUB in default application' ],
      [ '--debug', 'run epub with debug output' ],
    ],
  }

  constructor() {
    super(EpubCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }

    const input = path.join(projectRoot, paths.epub)

    if (!fs.existsSync(input)) {
      console.error(`Unable to find Epub input at ${input}\nPlease first run the 'quire build' command.`)
      return
    }

    const output = path.join(projectRoot, `${options.lib}.epub`)

    const epubLib = await libEpub(options.lib, { ...options.debug })
    await epubLib(input, output, { ...options.debug })

    if (fs.existsSync(output) && options.open) open(output)
  }

  /**
   * test if build site has already be run and output can be reused
   * @todo
   */
  preAction(command) {
    const options = command.opts()
    if (options.debug) {
      console.debug('[CLI] Calling \'epub\' command pre-action with options', options)
    }
  }
}
