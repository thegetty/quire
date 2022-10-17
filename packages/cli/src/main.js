#! /usr/bin/env node
import { Command } from 'commander'
import * as commands from './commands/index.js'

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
  .configureHelp({ sortSubcommands: true })

/**
 * Register each command as a subcommand of this program
 */
for (const commandName in commands) {
  const command = commands[commandName]

  const { action, description, args, options } = command

  const subCommand = program
    .command(commandName)
    .description(description)
    .addHelpCommand()
    .showHelpAfterError()

  args.forEach(([ arg, value, callback ]) => {
    subCommand.argument(arg, value, callback)
  })

  options.forEach(([ short, long, description, defaultValue ]) => {
    subCommand.option([short, long].join(', '), description, defaultValue)
  })

  subCommand.action((args) => action.apply(command, args))
}

/**
 * Run the program
 */
program.parse()
