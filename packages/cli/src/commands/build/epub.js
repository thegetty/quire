import Command from '#src/Command.js'
import { build } from '#lib/epub/index.js'
import open from 'open'

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
    args: [
    ],
    options: [
      [
        // '--lib <module>', 'use the specified epub module', 'epub',
        // { choices: ['epub'], default: 'epub' }
      ],
      [ '--open', 'open EPUB in default application' ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  constructor() {
    super(EpubCommand.definition)
  }

  action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }
    // const epub = await epub.build()
    // if (options.open) await open(epub)
  }

  /**
   * test if build site has already be run and output can be reused
   * @todo
   */
  preAction(command) {
    const options = command.opts()
    if (options.debug) {
      console.debug('[CLI] Calling \'build\' command pre-action with options', options)
    }
    // console.log(command.parent)
  }
}
