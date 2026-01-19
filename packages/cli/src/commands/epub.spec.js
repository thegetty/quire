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
  t.context.command = program.commands.find((cmd) => cmd.name() === 'epub')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "epub" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'epub')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has no arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 0, 'epub command should have no arguments')
})

test('registered command has correct options', (t) => {
  const { command } = t.context

  // Get all options
  const engineOption = command.options.find((opt) => opt.long === '--engine')
  const libOption = command.options.find((opt) => opt.long === '--lib')
  const buildOption = command.options.find((opt) => opt.long === '--build')
  const openOption = command.options.find((opt) => opt.long === '--open')
  const debugOption = command.options.find((opt) => opt.long === '--debug')

  // Verify all options exist
  t.truthy(engineOption, '--engine option should exist')
  t.truthy(libOption, '--lib option should exist (deprecated alias)')
  t.truthy(buildOption, '--build option should exist')
  t.truthy(openOption, '--open option should exist')
  t.truthy(debugOption, '--debug option should exist')

  // Verify they are Option instances
  t.true(engineOption instanceof Option, '--engine should be Option instance')
  t.true(libOption instanceof Option, '--lib should be Option instance')
  t.true(buildOption instanceof Option, '--build should be Option instance')
  t.true(openOption instanceof Option, '--open should be Option instance')
  t.true(debugOption instanceof Option, '--debug should be Option instance')

  // Verify --engine option properties
  t.is(engineOption.long, '--engine')
  t.truthy(engineOption.description)
  t.true(engineOption.required, '--engine should require a value')

  // Verify --lib is hidden (deprecated alias)
  t.is(libOption.long, '--lib')
  t.true(libOption.hidden, '--lib should be hidden (deprecated)')

  t.is(buildOption.long, '--build')
  t.truthy(buildOption.description)
  t.false(buildOption.required, '--build should not require a value')

  t.is(openOption.long, '--open')
  t.truthy(openOption.description)
  t.false(openOption.required, '--open should not require a value')

  t.is(debugOption.long, '--debug')
  t.truthy(debugOption.description)
  t.false(debugOption.required, '--debug should not require a value')
})

test('command options are accessible via public API', (t) => {
  const { command } = t.context

  // Test that options can be accessed the way Commander.js does
  const optionNames = command.options.map((opt) => opt.long)

  t.true(optionNames.includes('--engine'))
  t.true(optionNames.includes('--lib'))  // deprecated alias still exists
  t.true(optionNames.includes('--build'))
  t.true(optionNames.includes('--open'))
  t.true(optionNames.includes('--debug'))
})
