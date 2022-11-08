#!/usr/bin/env node
import { Command } from 'commander'
import commands from '#src/commands/index.js'
import localeService from '#lib/i18n/index.js'

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
  .version('1.0.0')
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

  if (Array.isArray(args)) {
    args.forEach(([ arg, value, callback ]) => {
      subCommand.argument(arg, value, callback)
    })
  }

  /**
   * @see https://github.com/tj/commander.js/#options
   */
  if (Array.isArray(options)) {
    options.forEach((option) => {
      if (Array.isArray(option)) {
        // ensure we can join the first two attributes as the option name
        // when only the short or the long flag is defined in the array
        if (option[0].startsWith('--')) option.unshift('\u0020'.repeat(4))
        if (option[0].startsWith('-') && !option[1].startsWith('--')) {
          option.splice(1, 0, '')
        }
        // assign attribute names to the array of option attributes
        const [ short, long, description, defaultValue ] = option
        // join short and long flags as the option name attribute
        const name = /^-\w/.test(short) && /^--\w/.test(long)
          ? [short, long].join(', ')
          : [short, long].join('')
        subCommand.option(name, description, defaultValue)
      } else {
        /**
         * @todo allow option attributes to be defined using an object
         * @see https://github.com/tj/commander.js/#more-configuration
         */
        // const option = new Option(name, description, defaultValue)
        // if (attributes.blarg) option.blagh(attributes.blarg)
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

  /**
   * Inject the configured LocaleService into Command class
   *
   * @todo consider refactoring to call `i18next.createInstance`
   * from each command constructor with the command `name`
   * passed as the i18next namespace to use for translations.
   */
  Object.defineProperty(subCommand, 'localeService', {
    get: function () { return localeService }
  })
})

/**
 * Export the command program
 */
export default program
