import { Argument, Command, Option } from 'commander'
import program from '#src/main.js'
import test from 'ava'

/**
 * Command Contract/Interface Tests
 *
 * Verifies the command's public API and Commander.js integration.
 * @see docs/testing-commands.md
 */

test.before((t) => {
  // Get the registered command (from program.commands) once and share across all tests
  t.context.command = program.commands.find((cmd) => cmd.name() === 'use')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "use" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'use')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has correct arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 1, 'command should have 1 argument')

  // First argument: version
  const version = registeredArguments[0]
  t.true(version instanceof Argument, 'version should be Argument instance')
  t.is(version.name(), 'version', 'first argument should be version')
  t.true(version.required, 'version should be required')
  t.truthy(version.description)
})

test('registered command has no options', (t) => {
  const { command } = t.context

  // Use command should have no custom options (only inherited help options)
  const options = command.options.filter((opt) => !opt.long.includes('help'))
  t.is(options.length, 0, 'use command should have no custom options')
})

test('command arguments are accessible via public API', (t) => {
  const { command } = t.context

  // Test that arguments can be accessed the way Commander.js does
  const argumentNames = command.registeredArguments.map((arg) => arg.name())

  t.true(argumentNames.includes('version'))
})
