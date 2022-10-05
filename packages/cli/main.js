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
  .version('1.0.0');

/**
 * Register each command as a subcommand of this program
 */
for (const command in commands) {
  console.log('command', command)

  const { args, description, name, options } = command.definition()

  // const subCommand = program
  //   .command(name)
  //   .description(description)

  // console.log('subCommand', subCommand)

  // args.forEach(([ arg, value, callback ]) => subCommand.argument(arg, value, callback))

  // options.forEach(([a, b, c, d]) => subCommand.option(a, b.join(','), c, d))

  // subCommand.action(() => command.action.apply(command, args))
}

/**
 * Run the program
 */
program.parse()
