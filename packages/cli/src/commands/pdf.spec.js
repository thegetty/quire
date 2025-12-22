import PDFCommand from '#src/commands/pdf.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new PDFCommand()

  // Stub the name method since it comes from Commander.js
  t.context.command.name = t.context.sandbox.stub().returns('pdf')

  // Stub console methods to suppress output during tests
  if (!console.debug.restore) {
    t.context.consoleDebugStub = t.context.sandbox.stub(console, 'debug')
    t.context.consoleErrorStub = t.context.sandbox.stub(console, 'error')
  } else {
    t.context.consoleDebugStub = console.debug
    t.context.consoleErrorStub = console.error
    t.context.consoleDebugStub.resetHistory()
    t.context.consoleErrorStub.resetHistory()
  }
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('command should be instantiated with correct definition', (t) => {
  // Create a fresh command without stubs for this test
  const command = new PDFCommand()

  t.is(command.name, 'pdf')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.true(command.args === undefined)
  t.truthy(Array.isArray(command.options))
})

test('command should have a lib option', (t) => {
  const { command } = t.context

  const libOption = command.options.find((opt) => opt[0] && opt[0].includes('--lib'))
  t.truthy(libOption)
  t.is(libOption[0], '--lib <module>')
  t.is(libOption[2], 'pagedjs') // default value
  t.truthy(libOption[3])
  t.deepEqual(libOption[3].choices, ['pagedjs', 'prince'])
})

test('command should have an open option', (t) => {
  const { command } = t.context

  const openOption = command.options.find((opt) => opt[0] === '--open')
  t.truthy(openOption)
  t.is(openOption[1], 'open PDF in default application')
})

test('command should have a debug option', (t) => {
  const { command } = t.context

  const debugOption = command.options.find((opt) => opt[0] === '--debug')
  t.truthy(debugOption)
  t.is(debugOption[1], 'run build with debug output to console')
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
