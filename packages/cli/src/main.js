import { Argument, Command, Option } from 'commander'
import commands from '#src/commands/index.js'
import config from '#lib/conf/config.js'
import { handleError } from '#lib/error/handler.js'
import packageConfig from '#src/packageConfig.js'

const { version } = packageConfig

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
  .version(version,  '-v, --version', 'output quire version number')
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
 * Register each command as a subcommand of this program
 *
 * @todo refactor command definition to allow for per-command custom help text
 * @see https://github.com/tj/commander.js?tab=readme-ov-file#automated-help
 */
commands.forEach((command) => {
  const { action, alias, aliases, args, description, name, options } = command

  const subCommand = program
    .command(name)
    .description(description)
    .addHelpCommand()
    .showHelpAfterError()

  if (alias instanceof String) {
    subCommand.alias(alias)
  }

  if (Array.isArray(aliases)) {
    subCommand.aliases(aliases)
  }

  /**
   * @see https://github.com/tj/commander.js#more-configuration-1
   */
  if (Array.isArray(args)) {
    args.forEach(([ name, description, configuration = {} ]) => {
      const argument = new Argument(name, description)
      if (configuration.choices) argument.choices(configuration.choices)
      if (configuration.default) argument.default(configuration.default)
      subCommand.addArgument(argument)
    })
  }

  /**
   * @see https://github.com/tj/commander.js/#options
   * @see https://github.com/tj/commander.js/#more-configuration
   */
  if (Array.isArray(options)) {
    options.forEach((entry) => {
      if (entry instanceof Option) {
        // Handle Option objects directly for advanced configurations
        subCommand.addOption(entry)
      } else if (Array.isArray(entry)) {
        if (entry[0]?.startsWith('-') && entry[1]?.startsWith('--')) {
          // option flags are defined separately: ['-s', '--long', ...]
          const [short, long, ...rest] = entry
          subCommand.option(`${short}, ${long}`, ...rest)
        } else {
          // option flags defined in a single string: ['-s --long', ...]
          subCommand.option(...entry)
        }
      } else {
        console.error('Options must be defined as arrays or Option instances')
      }
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
