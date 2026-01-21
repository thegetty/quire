import Command from '#src/Command.js'
import { hasEpubOutput } from '#lib/project/index.js'
import eleventy from '#lib/11ty/index.js'
import fs from 'fs-extra'
import generateEpub from '#lib/epub/index.js'
import open from 'open'
import reporter from '#lib/reporter/index.js'
import testcwd from '#helpers/test-cwd.js'

/**
 * Quire CLI `epub` Command
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
    summary: 'generate EPUB e-book',
    docsLink: 'quire-commands/#output-files',
    helpText: `
Output Modes:
  -q, --quiet      Suppress progress output (for CI/scripts)
  -v, --verbose    Show detailed progress (paths, timing)
  --debug          Enable debug output for troubleshooting

Examples:
  quire epub                        Generate EPUB using default engine
  quire epub --engine pandoc        Generate EPUB using Pandoc
  quire epub --open                 Generate and open EPUB
  quire epub --build                Build site first, then generate EPUB
  quire epub --output my-book.epub  Generate EPUB with custom output path
`,
    version: '1.0.0',
    options: [
      [ '--build', 'run build first if output is missing' ],
      [ '--open', 'open EPUB in default application' ],
      [ '-o, --output <path>', 'output file path (default: {engine}.epub)' ],
      [
        '--engine <name>', 'EPUB engine to use', 'epubjs',
        { choices: ['epubjs', 'pandoc'], default: 'epubjs' }
      ],
      [
        '--lib <name>', 'deprecated alias for --engine option',
        { hidden: true, choices: ['epubjs', 'pandoc'], conflicts: 'engine' }
      ],
      [ '-q, --quiet', 'suppress progress output' ],
      [ '-v, --verbose', 'show detailed progress output' ],
      [ '--debug', 'enable debug output for troubleshooting' ],
    ],
  }

  constructor() {
    super(EpubCommand.definition)
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
    if (options.build && !hasEpubOutput()) {
      this.debug('running build before epub generation')
      reporter.start('Building site...', { showElapsed: true })
      await eleventy.build({ debug: options.debug })
    }

    // Check for build output (will throw if missing)
    // TODO: Add interactive prompt when build output missing and --build not used
    if (!hasEpubOutput()) {
      const error = new Error('EPUB output not found. Run "quire build" first, or use --build flag.')
      error.code = 'ENOBUILD'
      throw error
    }

    reporter.start(`Generating EPUB using ${options.engine}...`, { showElapsed: true })

    try {
      // Pass engine as lib (matching lib/pdf interface)
      const epubOptions = { ...options, lib: options.engine }
      const output = await generateEpub(epubOptions)

      reporter.succeed('EPUB generated')

      if (fs.existsSync(output) && options.open) open(output)
    } catch (error) {
      reporter.fail('EPUB generation failed')
      throw error
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
