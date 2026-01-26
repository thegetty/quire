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
  t.context.command = program.commands.find((cmd) => cmd.name() === 'build')
})

test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command "build" should be registered in program')
  t.true(command instanceof Command, 'registered command should be Commander.js Command instance')
})

test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'build')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function', 'command should have action handler')
})

test('registered command has no arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 0, 'build command should have no arguments')
})

test('registered command has correct options', (t) => {
  const { command } = t.context

  // Get all options
  const dryRunOption = command.options.find((opt) => opt.long === '--dry-run')
  const dryrunAlias = command.options.find((opt) => opt.long === '--dryrun')
  const serveOption = command.options.find((opt) => opt.long === '--serve')
  const portOption = command.options.find((opt) => opt.long === '--port')
  const openOption = command.options.find((opt) => opt.long === '--open')
  const quietOption = command.options.find((opt) => opt.long === '--quiet')
  const verboseOption = command.options.find((opt) => opt.long === '--verbose')
  const progressOption = command.options.find((opt) => opt.long === '--progress')
  const eleventyOption = command.options.find((opt) => opt.long === '--11ty')
  const debugOption = command.options.find((opt) => opt.long === '--debug')

  // Verify all options exist
  t.truthy(dryRunOption, '--dry-run option should exist')
  t.truthy(dryrunAlias, '--dryrun alias should exist')
  t.truthy(serveOption, '--serve option should exist')
  t.truthy(portOption, '--port option should exist')
  t.truthy(openOption, '--open option should exist')
  t.truthy(quietOption, '--quiet option should exist')
  t.truthy(verboseOption, '--verbose option should exist')
  t.truthy(progressOption, '--progress option should exist')
  t.truthy(eleventyOption, '--11ty option should exist')
  t.truthy(debugOption, '--debug option should exist')

  // Verify they are Option instances
  t.true(dryRunOption instanceof Option, '--dry-run should be Option instance')
  t.true(dryrunAlias instanceof Option, '--dryrun should be Option instance')
  t.true(serveOption instanceof Option, '--serve should be Option instance')
  t.true(portOption instanceof Option, '--port should be Option instance')
  t.true(openOption instanceof Option, '--open should be Option instance')
  t.true(quietOption instanceof Option, '--quiet should be Option instance')
  t.true(verboseOption instanceof Option, '--verbose should be Option instance')
  t.true(progressOption instanceof Option, '--progress should be Option instance')
  t.true(eleventyOption instanceof Option, '--11ty should be Option instance')
  t.true(debugOption instanceof Option, '--debug should be Option instance')

  // Verify option properties
  t.is(dryRunOption.long, '--dry-run')
  t.is(dryRunOption.short, '-d')
  t.truthy(dryRunOption.description)

  // --dryrun is a hidden alias for --dry-run
  t.is(dryrunAlias.long, '--dryrun')
  t.true(dryrunAlias.hidden, '--dryrun should be hidden from help')

  t.is(serveOption.long, '--serve')
  t.truthy(serveOption.description)

  t.is(portOption.long, '--port')
  t.is(portOption.short, '-p')
  t.truthy(portOption.description)

  t.is(openOption.long, '--open')
  t.truthy(openOption.description)

  t.is(quietOption.long, '--quiet')
  t.is(quietOption.short, '-q')
  t.truthy(quietOption.description)

  t.is(verboseOption.long, '--verbose')
  t.is(verboseOption.short, '-v')
  t.truthy(verboseOption.description)

  // --progress is a hidden alias for --verbose
  t.is(progressOption.long, '--progress')
  t.truthy(progressOption.description)
  t.true(progressOption.hidden, '--progress should be hidden from help')

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

  t.true(optionNames.includes('--dry-run'))
  t.true(optionNames.includes('--dryrun'))
  t.true(optionNames.includes('--serve'))
  t.true(optionNames.includes('--port'))
  t.true(optionNames.includes('--open'))
  t.true(optionNames.includes('--quiet'))
  t.true(optionNames.includes('--verbose'))
  t.true(optionNames.includes('--progress'))
  t.true(optionNames.includes('--11ty'))
  t.true(optionNames.includes('--debug'))
})
