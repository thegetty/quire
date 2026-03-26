import { Command } from 'commander'
import program from './main.js'
import test from 'ava'

/**
 * Main Program Unit Tests
 *
 * Tests the CLI program configuration and setup.
 * Command registration is tested indirectly through command spec files.
 */

test('program exports a Commander.js Command instance', (t) => {
  t.truthy(program)
  t.true(program instanceof Command, 'program should be a Commander.js Command')
})

test('program has correct name and description', (t) => {
  t.is(program.name(), 'quire')
  t.truthy(program.description(), 'program should have a description')
  t.regex(program.description(), /quire/i, 'description should mention Quire')
})

test('program has version option with correct flags', (t) => {
  // Commander stores _version and the version option in the options array
  t.truthy(program._version, 'program should have version set')

  // Find the version option
  const versionOption = program.options.find((opt) => opt.long === '--version')
  t.truthy(versionOption, '--version option should exist')
  t.is(versionOption.short, '-v', 'version option should have -v short flag')
  t.truthy(versionOption.description, 'version option should have description')
})

test('program help is configured with correct width', (t) => {
  // Access the help configuration
  const helpConfig = program._helpConfiguration

  t.truthy(helpConfig, 'help configuration should exist')
  t.is(helpConfig.helpWidth, 80, 'help width should be 80')
})

test('program registers commands from commands/index.js', (t) => {
  // Verify commands are registered
  t.true(program.commands.length > 0, 'program should have registered commands')

  // Verify expected commands exist
  const commandNames = program.commands.map((cmd) => cmd.name())
  t.true(commandNames.includes('build'), 'build command should be registered')
  t.true(commandNames.includes('new'), 'new command should be registered')
  t.true(commandNames.includes('preview'), 'preview command should be registered')
  t.true(commandNames.includes('info'), 'info command should be registered')
})

test('program injects config into subcommands', (t) => {
  // Pick a registered command and verify dependency injection of the config
  const buildCommand = program.commands.find((cmd) => cmd.name() === 'build')

  t.truthy(buildCommand, 'build command should exist')
  t.truthy(buildCommand.config, 'subcommand should have config injected')
  t.is(typeof buildCommand.config.get, 'function', 'config should have get method')
})
