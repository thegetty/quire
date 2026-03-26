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
  t.context.command = program.commands.find((cmd) => cmd.name() === 'preview')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "preview" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'preview')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has no arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 0, 'preview command should have no arguments')
})

test('registered command has correct options', (t) => {
  const { command } = t.context

  // Get all options
  const portOption = command.options.find((opt) => opt.long === '--port')
  const quietOption = command.options.find((opt) => opt.long === '--quiet')
  const verboseOption = command.options.find((opt) => opt.long === '--verbose')
  const eleventyOption = command.options.find((opt) => opt.long === '--11ty')
  const debugOption = command.options.find((opt) => opt.long === '--debug')

  // Verify all options exist
  t.truthy(portOption, '--port option should exist')
  t.truthy(quietOption, '--quiet option should exist')
  t.truthy(verboseOption, '--verbose option should exist')
  t.truthy(eleventyOption, '--11ty option should exist')
  t.truthy(debugOption, '--debug option should exist')

  // Verify they are Option instances
  t.true(portOption instanceof Option, '--port should be Option instance')
  t.true(quietOption instanceof Option, '--quiet should be Option instance')
  t.true(verboseOption instanceof Option, '--verbose should be Option instance')
  t.true(eleventyOption instanceof Option, '--11ty should be Option instance')
  t.true(debugOption instanceof Option, '--debug should be Option instance')

  // Verify option properties
  t.is(portOption.long, '--port')
  t.is(portOption.short, '-p')
  t.truthy(portOption.description)
  t.true(portOption.required, '--port should require a value')

  t.is(quietOption.long, '--quiet')
  t.is(quietOption.short, '-q')
  t.truthy(quietOption.description)

  t.is(verboseOption.long, '--verbose')
  t.is(verboseOption.short, '-v')
  t.truthy(verboseOption.description)

  t.is(eleventyOption.long, '--11ty')
  t.truthy(eleventyOption.description)
  t.true(eleventyOption.required, '--11ty should require a value')

  t.is(debugOption.long, '--debug')
  t.truthy(debugOption.description)
  t.false(debugOption.required, '--debug should not require a value')
})

test('command options are accessible via public API', (t) => {
  const { command } = t.context

  // Test that options can be accessed the way Commander.js does
  const optionNames = command.options.map((opt) => opt.long)

  t.true(optionNames.includes('--port'))
  t.true(optionNames.includes('--quiet'))
  t.true(optionNames.includes('--verbose'))
  t.true(optionNames.includes('--11ty'))
  t.true(optionNames.includes('--debug'))
})
