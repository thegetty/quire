import Command from '#src/Command.js'
import { hasSiteOutput } from '#lib/project/index.js'
import eleventy from '#lib/11ty/index.js'
import generatePdf from '#lib/pdf/index.js'
import open from 'open'
import testcwd from '#helpers/test-cwd.js'

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
    summary: 'generate print-ready PDF',
    docsLink: 'quire-commands/#output-files',
    helpText: `
Examples:
  quire pdf --lib prince    Generate PDF using PrinceXML
  quire pdf --build         Build site first, then generate PDF
`,
    version: '1.0.0',
    options: [
      [ '--build', 'run build first if output is missing' ],
      [ '--open', 'open PDF in default application' ],
      [
        '--lib <module>', 'use the specified pdf module', 'pagedjs',
        { choices: ['pagedjs', 'prince'], default: 'pagedjs' }
      ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  constructor() {
    super(PDFCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    // Run build first if --build flag is set and output is missing
    if (options.build && !hasSiteOutput()) {
      this.debug('running build before pdf generation')
      await eleventy.build({ debug: options.debug })
    }

    // Check for build output (will throw if missing)
    // TODO: Add interactive prompt when build output missing and --build not used
    if (!hasSiteOutput()) {
      const error = new Error('Build output not found. Run "quire build" first, or use --build flag.')
      error.code = 'ENOBUILD'
      throw error
    }

    const output = await generatePdf(options)

    if (options.open) {
      open(output)
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
