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

test('registered command has correct options', (t) => {
  const { command } = t.context

  // Doctor command has unified --check option
  t.is(command.options.length, 1, 'doctor command should have 1 option')

  const checkOption = command.options.find((opt) => opt.long === '--check')
  t.truthy(checkOption, '--check option should exist')
  t.true(checkOption instanceof Option, '--check should be Option instance')
  t.is(checkOption.short, '-c', '--check should have -c short flag')
  t.truthy(checkOption.description)
  t.true(checkOption.description.includes('all'), 'description should mention "all"')
  t.true(checkOption.description.includes('environment'), 'description should mention section names')
  t.true(checkOption.description.includes('node'), 'description should mention check IDs')
})

test('command is accessible via checkup alias', (t) => {
  // Find command by alias
  const command = program.commands.find((cmd) => cmd.aliases().includes('checkup'))

  t.truthy(command, 'command should be findable via "checkup" alias')
  t.is(command.name(), 'doctor', 'alias should resolve to doctor command')
})
