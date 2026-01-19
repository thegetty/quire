import Command from '#src/Command.js'

/**
 * Quire CLI `workflows` Command
 *
 * Displays common workflow documentation.
 * Hidden from main help but accessible via `quire help workflows` or `quire workflows`.
 *
 * TODO: Refactor to an extensible `quire help <topic>` system that can load
 * help topics from a topics/ directory or markdown files. This would support:
 * - quire help workflows
 * - quire help debugging
 * - quire help publishing
 * - quire help configuration
 *
 * @class      WorkflowsCommand
 * @extends    {Command}
 */
export default class WorkflowsCommand extends Command {
  static definition = {
    name: 'workflows',
    description: 'Display common workflow documentation',
    summary: 'show common workflows',
    hidden: true,
    docsLink: 'quire-commands/',
    helpText: `
Common Workflows:

  Starting a New Project:
    quire new my-book && cd my-book && quire preview

  Building for Web:
    quire build                  Generate HTML site files
    quire clean && quire build   Clean build (recommended for production)

  Generating PDF:
    quire pdf --build            Build first, then generate PDF
    quire pdf --build --open     Generate and open PDF
    quire pdf --lib prince       Use PrinceXML instead of Paged.js

  Generating EPUB:
    quire epub --build           Build first, then generate EPUB
    quire epub --build --open    Generate and open EPUB

  Full Publication Build:
    quire clean && quire build && quire pdf && quire epub

  Troubleshooting:
    quire validate               Check YAML files for errors
    quire info                   Show version information
    quire build --verbose        Build with debug output

See full documentation: https://quire.getty.edu/docs-v1/
`,
    version: '1.0.0',
    options: [],
  }

  constructor() {
    super(WorkflowsCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)
    // The help text is automatically displayed via Commander's help system
    // If called directly (quire workflows), display help
    command.help()
  }
}
