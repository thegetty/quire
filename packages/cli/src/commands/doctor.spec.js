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

test('registered command has variadic checks argument', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 1, 'doctor command should have one argument')

  const checksArg = registeredArguments[0]
  t.is(checksArg.name(), 'checks', 'argument should be named "checks"')
  t.false(checksArg.required, 'checks argument should be optional')
  t.true(checksArg.variadic, 'checks argument should be variadic')
  t.truthy(checksArg.description, 'checks argument should have a description')
  t.true(checksArg.description.includes('all'), 'description should mention "all"')
  t.true(checksArg.description.includes('environment'), 'description should mention section names')
  t.true(checksArg.description.includes('node'), 'description should mention check IDs')
})

test('registered command has correct options', (t) => {
  const { command } = t.context

  // Doctor command has 4 local + 4 shared output mode options = 8
  // Local: --errors, --warnings, --json, --reset
  // Shared (via withOutputModes): --quiet, --verbose, --progress, --debug
  t.is(command.options.length, 8, 'doctor command should have 8 options')

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

  // Verify --reset option
  const resetOption = command.options.find((opt) => opt.long === '--reset')
  t.truthy(resetOption, '--reset option should exist')
  t.true(resetOption instanceof Option, '--reset should be Option instance')
  t.truthy(resetOption.description)

  // Verify shared output mode options (via withOutputModes)
  const quietOption = command.options.find((opt) => opt.long === '--quiet')
  t.truthy(quietOption, '--quiet option should exist')
  t.is(quietOption.short, '-q', '--quiet should have -q short flag')

  const verboseOption = command.options.find((opt) => opt.long === '--verbose')
  t.truthy(verboseOption, '--verbose option should exist')
  t.is(verboseOption.short, '-v', '--verbose should have -v short flag')

  const progressOption = command.options.find((opt) => opt.long === '--progress')
  t.truthy(progressOption, '--progress option should exist (hidden alias for --verbose)')

  const debugOption = command.options.find((opt) => opt.long === '--debug')
  t.truthy(debugOption, '--debug option should exist')
})

test('command is accessible via checkup alias', (t) => {
  // Find command by alias
  const command = program.commands.find((cmd) => cmd.aliases().includes('checkup'))

  t.truthy(command, 'command should be findable via "checkup" alias')
  t.is(command.name(), 'doctor', 'alias should resolve to doctor command')
})
