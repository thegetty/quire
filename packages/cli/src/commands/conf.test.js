import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  // Create sinon sandbox for mocking
  t.context.sandbox = sinon.createSandbox()

  // Create in-memory file system
  t.context.vol = new Volume()
  t.context.fs = createFsFromVolume(t.context.vol)

  // Create mock logger (no global console stubbing needed!)
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }

  // Mock config store
  t.context.mockConfig = {
    path: '/mock/config/path',
    store: {
      projectTemplate: 'default-starter',
      quireVersion: '1.0.0',
      __internal__secretKey: 'hidden-value'
    },
    get: (key) => t.context.mockConfig.store[key],
    set: t.context.sandbox.stub()
  }
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('conf command should display config path and values in single output', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./conf.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, {})

  // Should be called once with all output joined
  t.true(mockLogger.info.calledOnce)

  const output = mockLogger.info.firstCall.args[0]
  t.true(output.includes('quire-cli configuration /mock/config/path'))
  t.true(output.includes('projectTemplate: "default-starter"'))
  t.true(output.includes('quireVersion: "1.0.0"'))
})

test('conf command should hide internal config values by default', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./conf.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, {})

  const output = mockLogger.info.firstCall.args[0]
  t.false(output.includes('__internal__secretKey'))
})

test('conf command should show internal config values with debug flag', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./conf.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, { debug: true })

  const output = mockLogger.info.firstCall.args[0]
  t.true(output.includes('__internal__secretKey: "hidden-value"'))
})

test('conf command options are output when debug flag is set', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const mockDebug = sandbox.stub()

  const { default: ConfCommand } = await esmock('./conf.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = mockDebug

  await command.action(undefined, undefined, { debug: true })

  // Check that debug was called with options
  t.true(mockDebug.called, 'debug should be called')
  t.true(mockDebug.calledWith('called with options %O', { debug: true }))
})
