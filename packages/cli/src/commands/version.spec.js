import VersionCommand from '#src/commands/version.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new VersionCommand()

  // Stub the name method since it comes from Commander.js
  t.context.command.name = t.context.sandbox.stub().returns('version')

  // Stub console methods to suppress output during tests
  if (!console.info.restore) {
    t.context.consoleInfoStub = t.context.sandbox.stub(console, 'info')
  } else {
    t.context.consoleInfoStub = console.info
    t.context.consoleInfoStub.resetHistory()
  }
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('command should be instantiated with correct definition', (t) => {
  // Create a fresh command without stubs for this test
  const command = new VersionCommand()

  t.is(command.name, 'version')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.truthy(Array.isArray(command.args))
  t.truthy(Array.isArray(command.options))
})

test('command should have a version argument', (t) => {
  const { command } = t.context

  t.is(command.args.length, 1)
  t.is(command.args[0][0], '<version>')
  t.is(command.args[0][1], 'the local quire version to use')
})

test('action method should be defined', (t) => {
  const { command } = t.context

  t.is(typeof command.action, 'function')
})

test('preAction method should be defined', (t) => {
  const { command } = t.context

  t.is(typeof command.preAction, 'function')
})
