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

  // Doctor command has --check, --quiet, --verbose, --errors, --warnings, --json, --debug options
  t.is(command.options.length, 7, 'doctor command should have 7 options')

  // Verify --check option
  const checkOption = command.options.find((opt) => opt.long === '--check')
  t.truthy(checkOption, '--check option should exist')
  t.true(checkOption instanceof Option, '--check should be Option instance')
  t.is(checkOption.short, '-c', '--check should have -c short flag')
  t.truthy(checkOption.description)
  t.true(checkOption.description.includes('all'), 'description should mention "all"')
  t.true(checkOption.description.includes('environment'), 'description should mention section names')
  t.true(checkOption.description.includes('node'), 'description should mention check IDs')

  // Verify --verbose option
  const verboseOption = command.options.find((opt) => opt.long === '--verbose')
  t.truthy(verboseOption, '--verbose option should exist')
  t.true(verboseOption instanceof Option, '--verbose should be Option instance')
  t.is(verboseOption.short, '-v', '--verbose should have -v short flag')
  t.truthy(verboseOption.description)

  // Verify --errors option
  const errorsOption = command.options.find((opt) => opt.long === '--errors')
  t.truthy(errorsOption, '--errors option should exist')
  t.true(errorsOption instanceof Option, '--errors should be Option instance')
  t.is(errorsOption.short, '-e', '--errors should have -e short flag')
  t.truthy(errorsOption.description)

  // Verify --warnings option
  const warningsOption = command.options.find((opt) => opt.long === '--warnings')
  t.truthy(warningsOption, '--warnings option should exist')
  t.true(warningsOption instanceof Option, '--warnings should be Option instance')
  t.is(warningsOption.short, '-w', '--warnings should have -w short flag')
  t.truthy(warningsOption.description)

  // Verify --json option with optional file parameter
  const jsonOption = command.options.find((opt) => opt.long === '--json')
  t.truthy(jsonOption, '--json option should exist')
  t.true(jsonOption instanceof Option, '--json should be Option instance')
  t.truthy(jsonOption.description)
  t.true(jsonOption.description.includes('JSON'), 'description should mention JSON')
  t.true(jsonOption.description.includes('file'), 'description should mention file output')

  // Verify --quiet option
  const quietOption = command.options.find((opt) => opt.long === '--quiet')
  t.truthy(quietOption, '--quiet option should exist')
  t.true(quietOption instanceof Option, '--quiet should be Option instance')
  t.is(quietOption.short, '-q', '--quiet should have -q short flag')
  t.truthy(quietOption.description)

  // Verify --debug option
  const debugOption = command.options.find((opt) => opt.long === '--debug')
  t.truthy(debugOption, '--debug option should exist')
  t.true(debugOption instanceof Option, '--debug should be Option instance')
  t.truthy(debugOption.description)
})

test('command is accessible via checkup alias', (t) => {
  // Find command by alias
  const command = program.commands.find((cmd) => cmd.aliases().includes('checkup'))

  t.truthy(command, 'command should be findable via "checkup" alias')
  t.is(command.name(), 'doctor', 'alias should resolve to doctor command')
})
