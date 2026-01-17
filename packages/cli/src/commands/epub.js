import Command from '#src/Command.js'
import paths from '#lib/project/index.js'
import fs from 'fs-extra'
import libEpub from '#lib/epub/index.js'
import open from 'open'
import path from 'node:path'
import { MissingBuildOutputError } from '#src/errors/index.js'

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
    docsLink: 'quire-commands/#output-files',
    helpText: 'Note: Requires "quire build" to be run first.',
    version: '1.0.0',
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
    this.debug('called with options %O', options)

    const projectRoot = paths.getProjectRoot()
    const input = path.join(projectRoot, paths.getEpubDir())

    if (!fs.existsSync(input)) {
      throw new MissingBuildOutputError('epub', input)
    }

    const output = path.join(projectRoot, `${options.lib}.epub`)

    const epubLib = await libEpub(options.lib, { debug: options.debug })
    await epubLib(input, output)

    if (fs.existsSync(output) && options.open) open(output)
  }

  /**
   * @todo test if build site has already be run and output can be reused
   */
  preAction(command) {
    const options = command.opts()
    this.debug('pre-action with options %O', options)
  }
}
