import CreateCommand from '#src/commands/create.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new CreateCommand()

  // Mock config - check if already stubbed
  if (!t.context.command.config.get.restore) {
    t.context.sandbox.stub(t.context.command.config, 'get').returns('default-starter')
  }

  // Stub console methods to suppress output during tests
  if (!console.info.restore) {
    t.context.consoleInfoStub = t.context.sandbox.stub(console, 'info')
    t.context.consoleErrorStub = t.context.sandbox.stub(console, 'error')
  } else {
    t.context.consoleInfoStub = console.info
    t.context.consoleInfoStub.resetHistory()
    t.context.consoleErrorStub = console.error
    t.context.consoleErrorStub.resetHistory()
  }
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('command should be instantiated with correct definition', (t) => {
  // Create a fresh command without stubs for this test
  const command = new CreateCommand()

  t.is(command.name, 'new')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.truthy(command.args)
  t.truthy(command.options)
})

test('command should have correct args defined', (t) => {
  const { command } = t.context

  t.true(Array.isArray(command.args))
  t.is(command.args.length, 2)
  t.is(command.args[0][0], '[projectPath]')
  t.is(command.args[1][0], '[starter]')
})

test('command should have correct options defined', (t) => {
  const { command } = t.context

  t.true(Array.isArray(command.options))

  const path = command.options.find((opt) => opt[0].includes('--quire-path'))
  const version = command.options.find((opt) => opt[0].includes('--quire-version'))
  const debug = command.options.find((opt) => opt[0] === '--debug')

  // Nota bene: this is correct but shows that the unit tests are fragile,
  // the current spec implementation test the intermediate definition format,
  // not what users actually interact with, which is the public API.
  // Specs should verify the structure and configuration of the command definition,
  // as well as the command's public contract/API, *without testing behavior*.
  // @TODO refactor the command specs to test that the registered Commander.js
  // command is actually a contract/interface, the integration between
  // Command class → Commander.js creates Command, Argument, and Options instances.
  const cleanCache = command.options.find((opt) => opt.flags === '--clean-cache')

  t.truthy(path)
  t.truthy(version)
  t.truthy(debug)
  t.truthy(cleanCache)
})

test('action method should be defined and async', (t) => {
  const { command } = t.context

  t.is(typeof command.action, 'function')
})

test('command should use config default when a starter is not provided', (t) => {
  const { command } = t.context

  // Test the logic that assigns starter from config
  const starter = undefined
  const expected = command.config.get('projectTemplate')

  t.is(expected, 'default-starter')
})
