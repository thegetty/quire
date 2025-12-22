import ValidateCommand from '#src/commands/validate.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new ValidateCommand()

  // Stub the name method since it comes from Commander.js
  t.context.command.name = t.context.sandbox.stub().returns('validate')

  // Stub console methods to suppress output during tests
  if (!console.debug.restore) {
    t.context.consoleDebugStub = t.context.sandbox.stub(console, 'debug')
    t.context.consoleLogStub = t.context.sandbox.stub(console, 'log')
    t.context.consoleErrorStub = t.context.sandbox.stub(console, 'error')
  } else {
    t.context.consoleDebugStub = console.debug
    t.context.consoleLogStub = console.log
    t.context.consoleErrorStub = console.error
    t.context.consoleDebugStub.resetHistory()
    t.context.consoleLogStub.resetHistory()
    t.context.consoleErrorStub.resetHistory()
  }
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('command should be instantiated with correct definition', (t) => {
  // Create a fresh command without stubs for this test
  const command = new ValidateCommand()

  t.is(command.name, 'validate')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.true(command.args === undefined)
  t.truthy(Array.isArray(command.options))
})

test('command should have a debug option', (t) => {
  const { command } = t.context

  const debugOption = command.options.find((opt) => opt[0] === '--debug')
  t.truthy(debugOption)
  t.is(debugOption[1], 'run validate with debug output to console')
})

test('action method should be defined', (t) => {
  const { command } = t.context

  t.is(typeof command.action, 'function')
})

test('preAction method should be defined', (t) => {
  const { command } = t.context

  t.is(typeof command.preAction, 'function')
})
