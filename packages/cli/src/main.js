import { Command, Argument, Option } from 'commander'
import { arrayToArgument, arrayToOption } from '#lib/commander/index.js'
import { DOCS_BASE_URL } from '#lib/constants.js'
import commands from '#src/commands/index.js'
import config from '#lib/conf/config.js'
import { handleError } from '#lib/error/handler.js'
import packageConfig from '#src/packageConfig.js'
import { enableDebug } from '#lib/logger/debug.js'

const { version } = packageConfig

/**
 * Join base URL with path, handling trailing/leading slashes correctly
 * @param {string} path - Path to append to base URL
 * @returns {string} Full URL
 */
const docsUrl = (path) => new URL(path, DOCS_BASE_URL + '/').href

const mainHelpText = `
Docs: ${DOCS_BASE_URL}

Common Workflows:
  New project     quire new my-book && cd my-book && quire preview
  Build for web   quire build
  Generate PDF    quire pdf --build
  Generate EPUB   quire epub --build

  Run 'quire help workflows' for detailed workflow documentation.

Environment Variables:
  DEBUG=quire:*          Enable debug output for all modules
  DEBUG=quire:lib:pdf    Enable debug output for PDF module only
  DEBUG=quire:lib:*      Enable debug output for all lib modules

Examples:
  $ quire build                  Build the publication
  $ quire build --verbose        Build with debug output
  $ DEBUG=quire:* quire pdf      Generate PDF with debug output
`

/**
 * Quire CLI implements the command pattern.
 *
 * The `main` module acts as the _receiver_, parsing input from the client,
 * calling the appropriate command module(s), managing messages between modules,
 * and sending formatted messages to the client for display.
 */
const program = new Command()

program
  .name('quire')
  .description('Quire command-line interface')
  .version(version, '-v, --version', 'output quire version number')
  .option('--verbose', 'enable verbose output for debugging')
  .addHelpText('after', mainHelpText)
  .configureHelp({
    helpWidth: 80,
    sortOptions: false,
    sortSubcommands: false,
    styleOptionTerm: (term) => {
      // Add spacing to long-only options to align with short-flag options
      return /^-\w/.test(term) ? term : term.padStart(term.length + 4)
    },
  })

/**
 * Handle global --verbose option before any command runs
 */
program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts()
  if (opts.verbose) {
    enableDebug('quire:*')
  }
})

/**
 * Register each command as a subcommand of this program
 * @see https://github.com/tj/commander.js?tab=readme-ov-file#automated-help
 */
commands.forEach((command) => {
  const { action, alias, aliases, args, description, docsLink, helpText, hidden, name, options, summary } = command

  const subCommand = program
    .command(name, { hidden })
    .description(description)
    .summary(summary || description)
    .addHelpCommand()
    .showHelpAfterError()

  // Append docs link and/or custom help text after built-in help
  const customHelpText = [
    docsLink && `Docs: ${docsUrl(docsLink)}`,
    helpText?.trim()
  ].filter(Boolean).join('\n\n')

  if (customHelpText) {
    subCommand.addHelpText('after', '\n' + customHelpText)
  }

  if (typeof alias === 'string') {
    subCommand.alias(alias)
  }

  if (Array.isArray(aliases)) {
    subCommand.aliases(aliases)
  }

  /**
   * Register arguments with the subcommand
   */
  if (Array.isArray(args)) {
    args.forEach((entry) => {
      const argument = entry instanceof Argument ? entry : arrayToArgument(entry)
      subCommand.addArgument(argument)
    })
  }

  /**
   * Register options with the subcommand
   */
  if (Array.isArray(options)) {
    options.forEach((entry) => {
      const option = entry instanceof Option ? entry : arrayToOption(entry)
      subCommand.addOption(option)
    })
  }

  if (command.postAction) {
    subCommand.hook('postAction', (thisCommand, actionCommand) => {
      command.postAction.call(command, thisCommand, actionCommand)
    })
  }

  if (command.preAction) {
    subCommand.hook('preAction', (thisCommand, actionCommand) => {
      command.preAction.call(command, thisCommand, actionCommand)
    })
  }

  if (command.preSubcommand) {
    subCommand.hook('preSubcommand', (thisCommand, theSubcommand) => {
      command.preSubcommand.call(command, thisCommand, theSubcommand)
    })
  }

  // Wrap action in centralized error handler
  // Using apply() preserves `this` context for `this.debug` and `this.logger`
  subCommand.action(async (...args) => {
    try {
      await action.apply(command, args)
    } catch (error) {
      handleError(error)
    }
  })

  /**
   * Inject the CLI configuration into commands
   */
  subCommand.config = config
})

/**
 * Export the command program
 */
export default program
