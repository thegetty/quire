import { Argument, Command, Option } from 'commander'
import commands from '#src/commands/index.js'
import config from '#lib/conf/config.js'
import { handleError } from '#lib/error/handler.js'
import packageConfig from '#src/packageConfig.js'
import { enableDebug } from '#lib/logger/debug.js'

const { version } = packageConfig

/**
 * Base URL for documentation links appended to command help text
 */
const DOCS_BASE_URL = 'https://quire.getty.edu/docs-v1/'

/**
 * Join base URL with path, handling trailing/leading slashes correctly
 * @param {string} path - Path to append to base URL
 * @returns {string} Full URL
 */
const docsUrl = (path) => new URL(path, DOCS_BASE_URL).href

const mainHelpText = `
Docs: ${DOCS_BASE_URL}

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
   * Convert a command arg defined using array-syntax to an Argument object
   *
   * @param {Array} entry - Argument definition array [name, description, { choices, default }]
   * @returns {Argument} Commander Argument object
   * @see https://github.com/tj/commander.js?tab=readme-ov-file#command-arguments
   * @see https://github.com/tj/commander.js#more-configuration-1
   */
  const arrayToArgument = (entry) => {
    const [name, description, config = {}] = entry
    const argument = new Argument(name, description)
    if (config.choices) argument.choices(config.choices)
    if (config.default) argument.default(config.default)
    return argument
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
   * Convert a command option defined using array-syntax to an Option object
   *
   * Supports two array formats:
   * - Separate flags: ['-s', '--long <value>', 'description', default, { choices, default }]
   * - Combined flags: ['--long <value>', 'description', default, { choices, default }]
   *
   * @param {Array} entry - Option definition array
   * @returns {Option} Commander Option object
   * @see https://github.com/tj/commander.js/#options
   * @see https://github.com/tj/commander.js/#more-configuration
   */
  const arrayToOption = (entry) => {
    const lastElement = entry[entry.length - 1]
    const configObj = typeof lastElement === 'object' && lastElement !== null ? lastElement : null

    let flags, description, defaultValue
    if (entry[0]?.startsWith('-') && entry[1]?.startsWith('--')) {
      // Array has separate elements for short and long option flags
      // @example ['-s', '--long <value>', 'desc', ...]
      flags = `${entry[0]}, ${entry[1]}`
      description = entry[2]
      defaultValue = entry[3]
    } else {
      // Array has a single element with option flags
      // @example ['--long <value>', 'desc', ...]
      flags = entry[0]
      description = entry[1]
      defaultValue = entry[2]
    }

    const option = new Option(flags, description)

    if (configObj) {
      if (configObj.choices) option.choices(configObj.choices)
      if (configObj.default !== undefined) option.default(configObj.default)
    } else if (defaultValue !== undefined) {
      option.default(defaultValue)
    }

    return option
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
