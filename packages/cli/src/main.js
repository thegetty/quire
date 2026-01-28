import { Command, Argument, Option } from 'commander'
import {
  arrayToArgument,
  arrayToOption,
  quietOption,
  verboseOption,
  debugOption
} from '#lib/commander/index.js'
import commands from '#src/commands/index.js'
import config from '#lib/conf/config.js'
import { handleError } from '#lib/error/handler.js'
import { docsUrl, DOCS_BASE } from '#helpers/docs-url.js'
import packageConfig from '#src/packageConfig.js'
import { enableDebug } from '#lib/logger/debug.js'

const { version } = packageConfig

const mainHelpText = `
Docs: ${DOCS_BASE}

Common Workflows:
  New project     quire new my-book && cd my-book && quire preview
  Build for web   quire build
  Generate PDF    quire pdf --build
  Generate EPUB   quire epub --build

  Run 'quire help workflows' for detailed workflow documentation.

Output Modes:
  -q, --quiet      Suppress progress output (for CI/scripts)
  -v, --verbose    Show detailed progress (paths, timing, steps)
  --debug          Enable debug output for developers/troubleshooting

  Set defaults: quire settings set verbose true

Paging:
  --no-pager             Disable paging for long output
  NO_PAGER=1             Disable paging via environment variable
  PAGER=cat              Traditional Unix alternative (passes output through)

Environment Variables:
  NO_PAGER=1             Disable paging for long output
  PAGER=<program>        Set pager program (default: less). Use PAGER=cat to disable
  DEBUG=quire:*          Enable debug output for all modules
  DEBUG=quire:lib:pdf    Enable debug output for PDF module only
  DEBUG=quire:lib:*      Enable debug output for all lib modules

Examples:
  $ quire build                  Build the publication
  $ quire build --verbose        Build with detailed progress
  $ quire build --debug          Build with debug output
  $ DEBUG=quire:* quire pdf      Generate PDF with debug output
`

/**
 * Quire CLI implements the command pattern.
 *
 * The \`main\` module acts as the _receiver_, parsing input from the client,
 * calling the appropriate command module(s), managing messages between modules,
 * and sending formatted messages to the client for display.
 */
const program = new Command()

program
  .name('quire')
  .description('Quire command-line interface')
  .version(version, '-V, --version', 'output quire version number')
  .addOption(arrayToOption(quietOption))
  .addOption(arrayToOption(verboseOption))
  .addOption(arrayToOption(debugOption))
  .option('--no-pager', 'disable paging for long output')
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
 * Handle global options before any command runs
 *
 * Output mode semantics:
 * - --quiet: Suppress progress spinners (for CI/scripts)
 * - --verbose: Show detailed progress (paths, timing, steps)
 * - --debug: Enable DEBUG namespace + tool debug modes (for developers)
 *
 * These global options are passed through to commands via opts()
 * and should be merged with command-level options.
 */
program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts()

  // --debug or config.debug enables the quire:* DEBUG namespace for internal logging
  // CLI flag takes precedence, then config setting
  if (opts.debug ?? config.get('debug')) {
    enableDebug('quire:*')
  }

  // --no-pager sets pager to false; propagate via env var for pager utility
  if (opts.pager === false) {
    process.env.NO_PAGER = '1'
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

  /**
   * Command lifecycle hook: called after action handler and nested subcommands
   * @see https://github.com/tj/commander.js?tab=readme-ov-file#life-cycle-hooks
   */
  if (command.postAction) {
    subCommand.hook('postAction', async (thisCommand, actionCommand) => {
      try {
        await command.postAction.call(command, thisCommand, actionCommand)
      } catch (error) {
        const { debug } = program.opts()
        handleError(error, { debug })
      }
    })
  }

  /**
   * Command lifecycle hook: called before action handler and nested subcommands
   * @see https://github.com/tj/commander.js?tab=readme-ov-file#life-cycle-hooks
   */
  if (command.preAction) {
    subCommand.hook('preAction', async (thisCommand, actionCommand) => {
      try {
        await command.preAction.call(command, thisCommand, actionCommand)
      } catch (error) {
        const { debug } = program.opts()
        handleError(error, { debug })
      }
    })
  }

  /**
   * Subcommand lifecyle hook: called before parsing direct subcommand
   * @see https://github.com/tj/commander.js?tab=readme-ov-file#life-cycle-hooks
   */
  if (command.preSubcommand) {
    subCommand.hook('preSubcommand', async (thisCommand, theSubcommand) => {
      try {
        await command.preSubcommand.call(command, thisCommand, theSubcommand)
      } catch (error) {
        const { debug } = program.opts()
        handleError(error, { debug })
      }
    })
  }

  // Wrap action in centralized error handler
  // Using apply() preserves `this` context for `this.debug` and `this.logger`
  subCommand.action(async (...args) => {
    try {
      await action.apply(command, args)
    } catch (error) {
      const { debug } = program.opts()
      handleError(error, { debug })
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
