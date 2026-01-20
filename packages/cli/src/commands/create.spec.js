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
  t.context.command = program.commands.find((cmd) => cmd.name() === 'new')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "new" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'new')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has correct arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 2, 'command should have 2 arguments')

  // First argument: projectPath
  const projectPath = registeredArguments[0]
  t.true(projectPath instanceof Argument, 'projectPath should be Argument instance')
  t.is(projectPath.name(), 'projectPath', 'first argument should be projectPath')
  t.false(projectPath.required, 'projectPath should be optional')
  t.truthy(projectPath.description)

  // Second argument: starter
  const starter = registeredArguments[1]
  t.true(starter instanceof Argument, 'starter should be Argument instance')
  t.is(starter.name(), 'starter', 'second argument should be starter')
  t.false(starter.required, 'starter should be optional')
  t.truthy(starter.description)
})

test('registered command has correct options', (t) => {
  const { command } = t.context

  // Get all options
  const quirePathOption = command.options.find((opt) => opt.long === '--quire-path')
  const quireVersionOption = command.options.find((opt) => opt.long === '--quire-version')
  const quietOption = command.options.find((opt) => opt.long === '--quiet')
  const verboseOption = command.options.find((opt) => opt.long === '--verbose')
  const debugOption = command.options.find((opt) => opt.long === '--debug')

  // Verify all options exist
  t.truthy(quirePathOption, '--quire-path option should exist')
  t.truthy(quireVersionOption, '--quire-version option should exist')
  t.truthy(quietOption, '--quiet option should exist')
  t.truthy(verboseOption, '--verbose option should exist')
  t.truthy(debugOption, '--debug option should exist')

  // Verify they are Option instances
  t.true(quirePathOption instanceof Option, '--quire-path should be Option instance')
  t.true(quireVersionOption instanceof Option, '--quire-version should be Option instance')
  t.true(quietOption instanceof Option, '--quiet should be Option instance')
  t.true(verboseOption instanceof Option, '--verbose should be Option instance')
  t.true(debugOption instanceof Option, '--debug should be Option instance')

  // Verify option properties
  t.is(quirePathOption.long, '--quire-path')
  t.truthy(quirePathOption.description)
  t.true(quirePathOption.required, '--quire-path should require a value')

  t.is(quireVersionOption.long, '--quire-version')
  t.truthy(quireVersionOption.description)
  t.true(quireVersionOption.required, '--quire-version should require a value')

  t.is(quietOption.long, '--quiet')
  t.is(quietOption.short, '-q', '--quiet should have -q short flag')
  t.truthy(quietOption.description)
  t.false(quietOption.required, '--quiet should not require a value')

  t.is(verboseOption.long, '--verbose')
  t.is(verboseOption.short, '-v', '--verbose should have -v short flag')
  t.truthy(verboseOption.description)
  t.false(verboseOption.required, '--verbose should not require a value')

  t.is(debugOption.long, '--debug')
  t.truthy(debugOption.description)
  t.false(debugOption.required, '--debug should not require a value')
})

test('command options are accessible via public API', (t) => {
  const { command } = t.context

  // Test that options can be accessed the way Commander.js does
  const optionNames = command.options.map((opt) => opt.long)

  t.true(optionNames.includes('--quire-path'))
  t.true(optionNames.includes('--quire-version'))
  t.true(optionNames.includes('--quiet'))
  t.true(optionNames.includes('--verbose'))
  t.true(optionNames.includes('--debug'))
})
