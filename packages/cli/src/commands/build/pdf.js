import Command from '#src/Command.js'
import { api, cli, paths, projectRoot  } from '#lib/11ty/index.js'

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
      [ '-d', '--dry-run', 'run build without writing files' ],
      [ '-o', '--open', 'open PDF in default application' ],
      [ '-q', '--quiet', 'run build with no console messages' ],
      [ '-v', '--verbose', 'run build with verbose console messages' ],
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
    // pagedjs-cli _site/pdf.html --outline-tags 'h1' -o paged.pdf
    // prince _site/pdf.html --output prince.pdf
  }
}
