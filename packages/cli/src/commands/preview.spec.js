import PreviewCommand from '#src/commands/preview.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new PreviewCommand()

  // Stub the name method since it comes from Commander.js
  t.context.command.name = t.context.sandbox.stub().returns('preview')

  // Stub console methods to suppress output during tests
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
  const command = new PreviewCommand()

  t.is(command.name, 'preview')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.true(Array.isArray(command.args))
  t.truthy(Array.isArray(command.options))
})

test('command should have a port option', (t) => {
  const { command } = t.context

  const portOption = command.options.find((opt) => opt.includes('--port <port>'))
  t.truthy(portOption)
  t.is(portOption[0], '-p')
  t.is(portOption[1], '--port <port>')
  t.is(portOption[3], 8080) // default value
})

test('command should have a quiet option', (t) => {
  const { command } = t.context

  const quietOption = command.options.find((opt) => opt.includes('--quiet'))
  t.truthy(quietOption)
  t.true(quietOption.includes('-q'))
  t.true(quietOption.includes('--quiet'))
})

test('command should have a verbose option', (t) => {
  const { command } = t.context

  const verboseOption = command.options.find((opt) => opt.includes('--verbose'))
  t.truthy(verboseOption)
  t.true(verboseOption.includes('-v'))
  t.true(verboseOption.includes('--verbose'))
})

test('command should have an 11ty option', (t) => {
  const { command } = t.context

  const eleventyOption = command.options.find((opt) => opt[0] && opt[0].includes('--11ty'))
  t.truthy(eleventyOption)
  t.is(eleventyOption[0], '--11ty <module>')
  t.is(eleventyOption[2], 'cli') // default value
})

test('command should have a debug option', (t) => {
  const { command } = t.context

  const debugOption = command.options.find((opt) => opt[0] === '--debug')
  t.truthy(debugOption)
  t.is(debugOption[1], 'run preview with debug output to console')
})

test('action method should be defined and async', (t) => {
  const { command } = t.context

  t.is(typeof command.action, 'function')
  t.is(command.action.constructor.name, 'AsyncFunction')
})

test('preAction method should be defined', (t) => {
  const { command } = t.context

  t.is(typeof command.preAction, 'function')
})
