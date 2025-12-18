import { mock } from 'node:test'
import fs from 'node:fs'
import InfoCommand from '#src/commands/info.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.command = new InfoCommand()

  // Stub the name method since it comes from Commander.js
  t.context.command.name = t.context.sandbox.stub().returns('info')

  // Check if get is already stubbed before stubbing
  if (!t.context.command.config.get.restore) {
    t.context.sandbox.stub(t.context.command.config, 'get').returns('.versions')
  }

  // Mock console methods for all tests
  t.context.consoleDebugMock = mock.method(console, 'debug')
  t.context.consoleInfoMock = mock.method(console, 'info')
  t.context.consoleWarnMock = mock.method(console, 'warn')
})

test.afterEach((t) => {
  t.context.sandbox.restore()
  mock.restoreAll()
})

test('command should be instantiated with correct definition', (t) => {
  // Create a fresh command without stubs for this test
  const command = new InfoCommand()

  t.is(command.name, 'info')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  // Note bene: args may be omitted from some command definitions
  t.true(command.args === undefined)
  t.true(Array.isArray(command.options))
})

test('command should have a debug option defined', (t) => {
  const { command } = t.context

  t.true(Array.isArray(command.options))
  const debugOption = command.options.find((opt) => opt[0] === '--debug')
  t.truthy(debugOption)
  t.is(debugOption[1], 'include os versions in output')
})

test('command options are output when the debug flag is set', async (t) => {
  const { command, consoleDebugMock, consoleInfoMock } = t.context

  const readFileMock = mock.method(fs, 'readFileSync', () => {
    if (readFileMock.mock.calls.length === 1) {
      return JSON.stringify({ cli: '1.0.0', starter: '2.0.0' })
    }
    return JSON.stringify({ version: '3.0.0' })
  })

  mock.method(fs, 'writeFileSync', () => {})

  await command.action({ debug: true }, command)

  // Wait a bit for async forEach to complete
  await new Promise(resolve => setTimeout(resolve, 100))

  t.true(consoleDebugMock.mock.calls.some(call =>
    call.arguments[0] === '[CLI] Command \'%s\' called with options %o' &&
    call.arguments[1] === 'info' &&
    JSON.stringify(call.arguments[2]) === JSON.stringify({ debug: true })
  ))
  t.true(consoleInfoMock.mock.calls.length > 0)
})

test('command should create a version file when missing', async (t) => {
  const { command, consoleWarnMock } = t.context

  const readFileMock = mock.method(fs, 'readFileSync', (filePath) => {
    // First call is for .versions file - throw error
    if (filePath === '.versions') {
      throw new Error('File not found')
    }
    // Subsequent calls are for package.json
    return JSON.stringify({ version: '3.0.0' })
  })

  const writeFileMock = mock.method(fs, 'writeFileSync')

  await command.action({}, command)

  t.is(consoleWarnMock.mock.calls.length, 1)
  const warnMessage = consoleWarnMock.mock.calls[0].arguments[0]
  t.true(warnMessage.includes('prior to version 1.0.0.rc-8'))
  t.true(writeFileMock.mock.calls.some(call =>
    call.arguments[0] === '.versions' &&
    call.arguments[1] === JSON.stringify({ cli: '<=1.0.0.rc-7' })
  ))
})

test('command should read information from version file', async (t) => {
  const { command } = t.context

  const readFileMock = mock.method(fs, 'readFileSync', () => {
    if (readFileMock.mock.calls.length === 1) {
      return JSON.stringify({ cli: '1.2.3', starter: '4.5.6' })
    }
    return JSON.stringify({ version: '7.8.9' })
  })

  mock.method(fs, 'writeFileSync', () => {})

  await command.action({}, command)

  t.true(readFileMock.mock.calls.some((call) => call.arguments[0] === '.versions'))
})
