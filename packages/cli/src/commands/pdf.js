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
  quire pdf                      Generate PDF using default engine
  quire pdf --engine prince      Generate PDF using PrinceXML
  quire pdf --build              Build site first, then generate PDF
  quire pdf --verbose            Generate with detailed progress
`,
    version: '1.0.0',
    options: [
      [ '--build', 'run build first if output is missing' ],
      [ '--open', 'open PDF in default application' ],
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

    // Configure reporter for this command
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
    }

    // Check for build output (will throw if missing)
    // TODO: Add interactive prompt when build output missing and --build not used
    if (!hasSiteOutput()) {
      const error = new Error('Build output not found. Run "quire build" first, or use --build flag.')
      error.code = 'ENOBUILD'
      throw error
    }

    reporter.start(`Generating PDF using ${options.engine}...`, { showElapsed: true })

    try {
      // Pass engine (not lib) to generatePdf
      const pdfOptions = { ...options, lib: options.engine }
      const output = await generatePdf(pdfOptions)

      reporter.succeed('PDF generated')

      if (options.open) {
        open(output)
      }
    } catch (error) {
      reporter.fail('PDF generation failed')
      throw error
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
