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
  t.context.command = program.commands.find((cmd) => cmd.name() === 'conf')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "conf" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'conf')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has correct aliases', (t) => {
  const { command } = t.context

  t.truthy(command.aliases)
  t.true(Array.isArray(command.aliases()))
  t.true(command.aliases().includes('config'))
  t.true(command.aliases().includes('configure'))
})

test('registered command has correct arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 3, 'conf command should have 3 arguments')

  // Verify operation argument
  const operationArg = registeredArguments[0]
  t.is(operationArg.name(), 'operation')
  t.false(operationArg.required, 'operation argument should be optional')

  // Verify key argument
  const keyArg = registeredArguments[1]
  t.is(keyArg.name(), 'key')
  t.false(keyArg.required, 'key argument should be optional')

  // Verify value argument
  const valueArg = registeredArguments[2]
  t.is(valueArg.name(), 'value')
  t.false(valueArg.required, 'value argument should be optional')
})

test('registered command has correct options', (t) => {
  const { command } = t.context

  // Get all options
  const debugOption = command.options.find((opt) => opt.long === '--debug')

  // Verify debug option exists
  t.truthy(debugOption, '--debug option should exist')

  // Verify it is an Option instance
  t.true(debugOption instanceof Option, '--debug should be Option instance')

  // Verify option properties
  t.is(debugOption.long, '--debug')
  t.truthy(debugOption.description)
  t.false(debugOption.required, '--debug should not require a value')

  // Verify no operation flags exist (operations are via positional argument)
  const deleteOption = command.options.find((opt) => opt.long === '--delete')
  const resetOption = command.options.find((opt) => opt.long === '--reset')
  const pathOption = command.options.find((opt) => opt.long === '--path')

  t.falsy(deleteOption, '--delete option should not exist (use delete operation)')
  t.falsy(resetOption, '--reset option should not exist (use reset operation)')
  t.falsy(pathOption, '--path option should not exist (use path operation)')
})

test('command options are accessible via public API', (t) => {
  const { command } = t.context

  // Test that options can be accessed the way Commander.js does
  const optionNames = command.options.map((opt) => opt.long)

  t.true(optionNames.includes('--debug'))
  t.is(optionNames.length, 1, 'should only have --debug option')
})
