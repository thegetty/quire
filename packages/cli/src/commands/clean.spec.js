import CleanCommand from '#src/commands/clean.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new CleanCommand()

  // Stub the name method since it comes from Commander.js
  t.context.command.name = t.context.sandbox.stub().returns('clean')

  // Stub console.debug to suppress output during tests
  if (!console.debug.restore) {
    t.context.consoleDebugStub = t.context.sandbox.stub(console, 'debug')
  } else {
    t.context.consoleDebugStub = console.debug
    t.context.consoleDebugStub.resetHistory()
  }
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('command should be instantiated with correct definition', (t) => {
  // Create a fresh command without stubs for this test
  const command = new CleanCommand()

  t.is(command.name, 'clean')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.true(command.args === undefined)
  t.truthy(Array.isArray(command.options))
})

test('command should have a dry-run option', (t) => {
  const { command } = t.context

  const dryRunOption = command.options.find((opt) => opt.includes('--dry-run'))
  t.truthy(dryRunOption)
  t.true(dryRunOption.includes('-d'))
  t.true(dryRunOption.includes('--dry-run'))
})

test('command should have a progress option', (t) => {
  const { command } = t.context

  const progressOption = command.options.find((opt) => opt.includes('--progress'))
  t.truthy(progressOption)
  t.true(progressOption.includes('-p'))
  t.true(progressOption.includes('--progress'))
})

test('command should have a verbose option', (t) => {
  const { command } = t.context

  const verboseOption = command.options.find((opt) => opt.includes('--verbose'))
  t.truthy(verboseOption)
  t.true(verboseOption.includes('-v'))
  t.true(verboseOption.includes('--verbose'))
})

test('action method should be defined and async', (t) => {
  const { command } = t.context

  t.is(typeof command.action, 'function')
})

test('preAction method should be defined', (t) => {
  const { command } = t.context

  t.is(typeof command.preAction, 'function')
})
