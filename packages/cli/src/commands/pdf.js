import Command from '#src/Command.js'
import { paths, projectRoot  } from '#lib/11ty/index.js'
import fs from 'fs-extra'
import libPdf from '#lib/pdf/index.js'
import open from 'open'
import path from 'node:path'

/**
 * Quire CLI `pdf` Command
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
        { choices: ['pagedjs', 'prince'], default: 'pagedjs' }
      ],
      [ '--open', 'open PDF in default application' ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  constructor() {
    super(PDFCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }

    const input = path.join(projectRoot, paths.output, 'pdf.html')

    if (!fs.existsSync(input)) {
      console.error(`Unable to find PDF input at ${input}\nPlease first run the 'quire build' command.`)
      return
    }

    const output = path.join(projectRoot, `${options.lib}.pdf`)

    const pdfLib = await libPdf(options.lib, { ...options.debug })
    const pdf = await pdfLib(input, output, { ...options.debug })
    if (options.open) open(pdf)
  }

  /**
   * test if build has already be run and output can be reused
   * @todo
   */
  preAction(command) {
    const options = command.opts()
    if (options.debug) {
      console.debug('[CLI] Calling \'build\' command pre-action with options', options)
    }
  }
}
