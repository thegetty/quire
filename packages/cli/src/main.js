#! /usr/bin/env node
import { Command } from 'commander'
import commands from './commands/index.js'

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
  const { name, action, description, args, options } = command

  const subCommand = program
    .command(name)
    .description(description)
    .addHelpCommand()
    .showHelpAfterError()

  if (Array.isArray(args)) {
    args.forEach(([ arg, value, callback ]) => {
      subCommand.argument(arg, value, callback)
    })
  }

  if (Array.isArray(options)) {
    options.forEach((option) => {
      // ensure we can join first two attributes as option name flags
      if (!option[1].startsWith('-')) option.unshift('')
      // assign an attribute name to the array of option attributes
      const [ short, long, description, defaultValue ] = option
      // only join short and long flag names when both are defined
      const name = /^\-\w/.test(short)
        ? [short, long].join(', ')
        : [short, long].join('    ')
      subCommand.option(name, description, defaultValue)
    })
  }

  subCommand.action((args) => action.apply(command, args))
})

/**
 * Run the program
 */
program.parse()
