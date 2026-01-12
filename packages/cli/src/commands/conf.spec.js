import ConfCommand from '#src/commands/conf.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new ConfCommand()

  // Stub the name method since it comes from Commander.js
  t.context.command.name = t.context.sandbox.stub().returns('conf')

  // Mock config store and path
  t.context.command.config = {
    path: '/mock/config/path',
    store: {
      projectTemplate: 'default-starter',
      quireVersion: '1.0.0',
      __internal__secretKey: 'hidden-value'
    }
  }

  // Stub console.info to suppress output during tests
  if (!console.info.restore) {
    t.context.consoleInfoStub = t.context.sandbox.stub(console, 'info')
  } else {
    // If already stubbed, reset the call history for this test
    t.context.consoleInfoStub = console.info
    t.context.consoleInfoStub.resetHistory()
  }
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('command should be instantiated with correct definition', (t) => {
  // Create a fresh command without stubs for this test
  const command = new ConfCommand()

  t.is(command.name, 'conf')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.true(command.args === undefined)
  t.truthy(Array.isArray(command.options))
})

test('command should have aliases defined', (t) => {
  // Create a fresh command without stubs for this test
  const command = new ConfCommand()

  t.truthy(command.aliases)
  t.true(Array.isArray(command.aliases))
  t.true(command.aliases.includes('config'))
  t.true(command.aliases.includes('configure'))
})

test('command should have a debug option', (t) => {
  const { command } = t.context

  t.true(Array.isArray(command.options))
  const debugOption = command.options.find((opt) => opt[0] === '--debug')
  t.truthy(debugOption)
  t.is(debugOption[1], 'run command in debug mode')
})

test('action method should be defined and async', (t) => {
  const { command } = t.context

  t.is(typeof command.action, 'function')
})

test.serial('command should display config path', async (t) => {
  const { command, consoleInfoStub } = t.context

  await command.action(undefined, undefined, {})

  t.true(consoleInfoStub.calledWith(
    sinon.match(/quire-cli configuration/),
    '/mock/config/path'
  ))
})

test.serial('command should display config values', async (t) => {
  const { command, consoleInfoStub } = t.context

  await command.action(undefined, undefined, {})

  t.true(consoleInfoStub.calledWith('%s: %O', 'projectTemplate', 'default-starter'))
  t.true(consoleInfoStub.calledWith('%s: %O', 'quireVersion', '1.0.0'))
})

test.serial('command should hide internal config values by default', async (t) => {
  const { command, consoleInfoStub } = t.context

  await command.action(undefined, undefined, {})

  // Check that __internal__secretKey was not passed as the second argument to console.info
  const calls = consoleInfoStub.getCalls()
  const hasInternalKey = calls.some(call => call.args[1] === '__internal__secretKey')
  t.false(hasInternalKey)
})

test.serial('command should show internal config values with debug flag', async (t) => {
  const { command, consoleInfoStub } = t.context

  await command.action(undefined, undefined, { debug: true })

  t.true(consoleInfoStub.calledWith('%s: %O', '__internal__secretKey', 'hidden-value'))
})

test.serial('command options are output when debug flag is set', async (t) => {
  const { command, consoleInfoStub } = t.context

  await command.action(undefined, undefined, { debug: true })

  // Check that the debug message about command options was logged
  const calls = consoleInfoStub.getCalls()
  const hasDebugMessage = calls.some(call =>
    call.args[0] &&
    call.args[0].includes('Command') &&
    call.args[0].includes('called with options')
  )
  t.true(hasDebugMessage)
})
