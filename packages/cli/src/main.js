import { Argument, Command, Option } from 'commander'
import commands from './commands/index.js'
import packageConfig from '../package.json' with { type: 'json' }

/**
 * Quire CLI implements the command pattern.
 *
 * The `main` module acts as the _receiver_, parsing input from the client,
 * calling the appropriate command module(s), managing messages between modules,
 * and sending formatted messages to the client for display.
 */
const program = new Command()

program
  .name('quire-cli')
  .description('Quire command-line interface')
  .version(packageConfig.version,  '-v, --version', 'output quire version number')
  .configureHelp({
    helpWidth: 80,
    sortOptions: false,
    sortSubcommands: false,
  })

/**
 * Register each command as a subcommand of this program
 */
commands.forEach((command) => {
  const { action, aliases, args, description, name, options } = command

  const subCommand = program
    .command(name)
    .description(description)
    .addHelpCommand()
    .showHelpAfterError()

  if (Array.isArray(aliases)) {
    aliases.forEach((alias) => subCommand.alias(alias))
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
   */
  if (Array.isArray(options)) {
    options.forEach((entry) => {
      if (Array.isArray(entry)) {
        // ensure we can join the first two attributes as the option name
        // when only the short or the long flag is defined in the array
        if (entry[0].startsWith('--')) entry.unshift('\u0020'.repeat(4))
        if (entry[0].startsWith('-') && !entry[1].startsWith('--')) {
          entry.splice(1, 0, '')
        }
        // assign attribute names to the array of option attributes
        const [ short, long, description, defaultValue ] = entry
        // join short and long flags as the option name attribute
        const name = /^-\w/.test(short) && /^--\w/.test(long)
          ? [short, long].join(', ')
          : [short, long].join('')
        subCommand.option(name, description, defaultValue)
      } else {
        /**
         * @todo allow options to be defined by a configuration object
         * @see https://github.com/tj/commander.js/#more-configuration
         */
        // const option = new Option(name, description)
        // for (const property of configuration) {
        //   option[property](configuration[property])
        // }
        // subCommand.addOption(option)
        console.error('@TODO please use an array to define option attributes')
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

  // subCommand.action((args) => action.apply(command, args))
  subCommand.action(action)
})

/**
 * Export the command program
 */
export default program
