import { Command } from 'commander'
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
  t.context.command = program.commands.find((cmd) => cmd.name() === 'doctor')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "doctor" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'doctor')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has correct aliases', (t) => {
  const { command } = t.context
  const aliases = command.aliases()

  t.true(aliases.includes('checkup'), 'should have "checkup" alias')
  t.true(aliases.includes('diagnostic'), 'should have "diagnostic" alias')
  t.true(aliases.includes('health'), 'should have "health" alias')
})

test('registered command has no arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 0, 'doctor command should have no arguments')
})

test('registered command has no options', (t) => {
  const { command } = t.context

  // Doctor command has no options
  t.is(command.options.length, 0, 'doctor command should have no options')
})

test('command is accessible via checkup alias', (t) => {
  // Find command by alias
  const command = program.commands.find((cmd) => cmd.aliases().includes('checkup'))

  t.truthy(command, 'command should be findable via "checkup" alias')
  t.is(command.name(), 'doctor', 'alias should resolve to doctor command')
})
