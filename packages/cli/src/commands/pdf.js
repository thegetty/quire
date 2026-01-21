import Command from '#src/Command.js'
import { hasSiteOutput } from '#lib/project/index.js'
import eleventy from '#lib/11ty/index.js'
import generatePdf from '#lib/pdf/index.js'
import open from 'open'
import reporter from '#lib/reporter/index.js'
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
Output Modes:
  -q, --quiet      Suppress progress output (for CI/scripts)
  -v, --verbose    Show detailed progress (paths, timing)
  --debug          Enable debug output for troubleshooting

Examples:
  quire pdf                       Generate PDF using default engine
  quire pdf --engine prince       Generate PDF using PrinceXML
  quire pdf --build               Build site first, then generate PDF
  quire pdf --output my-book.pdf  Generate PDF with custom output path
  quire pdf --verbose             Generate with detailed progress
`,
    version: '1.0.0',
    options: [
      [ '--build', 'run build first if output is missing' ],
      [ '--open', 'open PDF in default application' ],
      [ '-o, --output <path>', 'output file path (default: from project config)' ],
      [
        '--engine <name>', 'PDF engine to use', 'pagedjs',
        { choices: ['pagedjs', 'prince'], default: 'pagedjs' }
      ],
      [
        '--lib <name>', 'deprecated alias for --engine option',
        { hidden: true, choices: ['pagedjs', 'prince'], conflicts: 'engine' }
      ],
      [ '-q, --quiet', 'suppress progress output' ],
      [ '-v, --verbose', 'show detailed progress output' ],
      [ '--debug', 'enable debug output for troubleshooting' ],
    ],
  }

  constructor() {
    super(PDFCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)
    /**
     * Configure reporter for this command
     * reporter lifecycle (start/succeed/fail) is handled by the façade,
     * not by the command.
     */
    reporter.configure({ quiet: options.quiet, verbose: options.verbose })

    // Support deprecated --lib option (alias for --engine)
    if (options.lib && !options.engine) {
      options.engine = options.lib
    }

    // Run build first if --build flag is set and output is missing
    if (options.build && !hasSiteOutput()) {
      this.debug('running build before pdf generation')
      reporter.start('Building site...', { showElapsed: true })
      await eleventy.build({ debug: options.debug })
      reporter.succeed('Build complete')
    }

    // Generate PDF - façade handles validation, progress, and errors
    const pdfOptions = { ...options, lib: options.engine }
    const output = await generatePdf(pdfOptions)

    if (options.open) {
      open(output)
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
