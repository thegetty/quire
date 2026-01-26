import { Command, Option } from 'commander'
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
  t.context.command = program.commands.find((cmd) => cmd.name() === 'info')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "info" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'info')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has no arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 0, 'info command should have no arguments')
})

test('registered command has correct options', (t) => {
  const { command } = t.context

  const debugOption = command.options.find((opt) => opt.long === '--debug')

  t.truthy(debugOption, '--debug option should exist')
  t.true(debugOption instanceof Option, '--debug should be Option instance')
  t.truthy(debugOption.description)
  t.false(debugOption.required, '--debug should not require a value')
})
