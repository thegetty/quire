import { Command } from 'commander'
import { commands} from './commands/index.js'
import inquirer from 'inquirer'

/**
 * Quire CLI
 *
 * This module acts as the _receiver_ in a [command pattern](https://en.wikipedia.org/wiki/Command_pattern) implementation,
 * directing input to the appropriate command module(s) and managing messages
 * displayed to the user.
 */
const program = new Command()

for (const command of commands) {
  const { args, definition, help, options } = command.definition()

  const subcommand = program
    .command(definition)
    .description(help)

  args.forEach(([ arg, value ]) => subcommand.argument(arg, value))

  options.forEach(([a, b, c, d]) => subcommand.option(a, b.join(','), c, d))

  subcommand.action(() => command.action.apply(command, args))
}

program.parse()
