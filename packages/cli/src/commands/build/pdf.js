import Command from '#src/Command.js'
import { build } from '#lib/pdf/index.js'
import open from 'open'

/**
 * Quire CLI `build pdf` Command
 *
 * Generate PDF from Eleventy `build` output.
 *
 * @class      PDFCommand
 * @extends    {Command}
 */
export default class PDFCommand extends Command {
  static definition = {
    name: 'pdf',
    description: 'Generate publication PDF',
    summary: 'run build pdf',
    version: '1.0.0',
    args: [
    ],
    options: [
      [
        '--lib <module>', 'use the specified pdf module', 'pagedjs',
        // { choices: ['pagedjs', 'prince'], default: 'pagedjs' }
      ],
      [ '--open', 'open PDF in default application' ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  constructor() {
    super(PDFCommand.definition)
  }

  action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }
    const pdf = await pdf.build()
    if (options.open) await open(pdf)
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
