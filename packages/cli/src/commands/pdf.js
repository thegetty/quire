import Command from '#src/Command.js'
import generatePdf from '#lib/pdf/index.js'
import open from 'open'
import logger from '#src/lib/logger.js'

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
      logger.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }

    const output = await generatePdf(options)

    if (options.open) {
      open(output)
    }
  }

  /**
   * @todo test if build has already be run and output can be reused
   */
  preAction(command) {
    // testcwd(command)
  }
}
