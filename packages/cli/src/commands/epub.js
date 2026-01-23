import Command from '#src/Command.js'
import paths, { hasEpubOutput } from '#lib/project/index.js'
import eleventy from '#lib/11ty/index.js'
import fs from 'fs-extra'
import libEpub, { ENGINES } from '#lib/epub/index.js'
import open from 'open'
import path from 'node:path'
import testcwd from '#helpers/test-cwd.js'
import { MissingBuildOutputError } from '#src/errors/index.js'

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
Examples:
  quire epub --engine pandoc    Generate EPUB using Pandoc
  quire epub --open             Generate and open EPUB
  quire epub --build            Build site first, then generate EPUB
`,
    version: '1.0.0',
    options: [
      [ '--build', 'run build first if output is missing' ],
      [ '--open', 'open EPUB in default application' ],
      [
        '--engine <name>', 'EPUB engine to use (default: from config or epubjs)',
        { choices: ENGINES }
      ],
      [
        '--lib <name>', 'deprecated alias for --engine option',
        { hidden: true, choices: ENGINES, conflicts: 'engine' }
      ],
      [ '--debug', 'run epub with debug output' ],
    ],
  }

  constructor() {
    super(EpubCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    // Resolve engine: CLI --engine > deprecated --lib > config epubEngine > default
    if (!options.engine) {
      if (options.lib) {
        // Support deprecated --lib option
        options.engine = options.lib
      } else {
        // Use config setting or fallback to default
        options.engine = this.config.get('epubEngine') || 'epubjs'
      }
    }

    // Run build first if --build flag is set and output is missing
    if (options.build && !hasEpubOutput()) {
      this.debug('running build before epub generation')
      await eleventy.build({ debug: options.debug })
    }

    // Check for build output (will throw if missing)
    // TODO: Add interactive prompt when build output missing and --build not used
    const projectRoot = paths.getProjectRoot()
    const input = path.join(projectRoot, paths.getEpubDir())

    if (!hasEpubOutput()) {
      throw new MissingBuildOutputError('epub', input)
    }

    const output = path.join(projectRoot, `${options.engine}.epub`)

    const epubLib = await libEpub(options.engine, { debug: options.debug })
    await epubLib(input, output)

    if (fs.existsSync(output) && options.open) open(output)
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
