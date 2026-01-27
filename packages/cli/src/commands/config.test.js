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
      logLevel: 'info',
      logShowLevel: false,
      projectTemplate: 'https://github.com/thegetty/quire-starter-default',
      quireVersion: '1.0.0',
      __internal__secretKey: 'hidden-value',
      projects: { abc123: { projectPath: '/test', buildStatus: { build: { status: 'ok', timestamp: 1000 } } } }
    },
    get: (key) => t.context.mockConfig.store[key],
    set: t.context.sandbox.stub(),
    delete: t.context.sandbox.stub(),
    reset: t.context.sandbox.stub(),
    clear: t.context.sandbox.stub()
  }
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

// =============================================================================
// Show all (no operation)
// =============================================================================

test('conf command should display all config when no operation provided', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, {})

  // Should be called once with all output joined
  t.true(mockLogger.info.calledOnce)

  const output = mockLogger.info.firstCall.args[0]
  t.true(output.includes('quire-cli configuration /mock/config/path'))
  t.true(output.includes('logLevel: "info"'))
  t.true(output.includes('quireVersion: "1.0.0"'))
})

test('conf command should hide internal config values by default', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, {})

  const output = mockLogger.info.firstCall.args[0]
  t.false(output.includes('__internal__secretKey'))
})

test('conf command should show internal config values with debug flag', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, { debug: true })

  const output = mockLogger.info.firstCall.args[0]
  t.true(output.includes('__internal__secretKey: "hidden-value"'))
})

test('conf command should hide projects by default', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, {})

  const output = mockLogger.info.firstCall.args[0]
  t.false(output.includes('projects'))
})

test('conf command should show projects with debug flag', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, { debug: true })

  const output = mockLogger.info.firstCall.args[0]
  t.true(output.includes('projects'))
})

// =============================================================================
// Get operation
// =============================================================================

test('conf get should return a single value', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('get', 'logLevel', undefined, {})

  t.true(mockLogger.info.calledOnce)
  t.true(mockLogger.info.calledWith('logLevel: "info"'))
})

test('conf get should show error when key is missing', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('get', undefined, undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.true(mockLogger.error.calledWith('Usage: quire conf get <key>'))
})

test('conf get should show error for unknown key', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('get', 'unknownKey', undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.true(mockLogger.error.calledWith('Unknown configuration key: unknownKey'))
  t.true(mockLogger.info.calledOnce)
  t.true(mockLogger.info.firstCall.args[0].includes('Valid keys:'))
})

// =============================================================================
// Set operation
// =============================================================================

test('conf set should set a value', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('set', 'logLevel', 'debug', {})

  t.true(mockConfig.set.calledOnce)
  t.true(mockConfig.set.calledWith('logLevel', 'debug'))
  t.true(mockLogger.info.calledWith('logLevel: "debug"'))
})

test('conf set should show error when key is missing', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('set', undefined, undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.true(mockLogger.error.calledWith('Usage: quire conf set <key> <value>'))
})

test('conf set should show error when value is missing', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('set', 'logLevel', undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.true(mockLogger.error.calledWith('Usage: quire conf set <key> <value>'))
})

test('conf set should coerce boolean true values', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('set', 'logShowLevel', 'true', {})

  t.true(mockConfig.set.calledWith('logShowLevel', true))
})

test('conf set should coerce boolean false values', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('set', 'logShowLevel', 'false', {})

  t.true(mockConfig.set.calledWith('logShowLevel', false))
})

test('conf set should coerce numeric boolean values', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('set', 'logShowLevel', '1', {})
  t.true(mockConfig.set.calledWith('logShowLevel', true))

  mockConfig.set.resetHistory()

  await command.action('set', 'logShowLevel', '0', {})
  t.true(mockConfig.set.calledWith('logShowLevel', false))
})

test('conf set should show validation error for invalid enum value', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  // Make config.set throw an error for invalid values
  mockConfig.set.throws(new Error('Schema validation failed'))

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('set', 'logLevel', 'invalid', {})

  t.true(mockLogger.error.calledOnce)
  const errorOutput = mockLogger.error.firstCall.args[0]
  t.true(errorOutput.includes('Invalid value'))
  t.true(errorOutput.includes('Valid values:'))
})

// =============================================================================
// Delete operation
// =============================================================================

test('conf delete should delete a key', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('delete', 'logLevel', undefined, {})

  t.true(mockConfig.delete.calledOnce)
  t.true(mockConfig.delete.calledWith('logLevel'))
  t.true(mockLogger.info.calledOnce)
  t.true(mockLogger.info.firstCall.args[0].includes('reset to'))
})

test('conf delete should show error when key is missing', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('delete', undefined, undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.true(mockLogger.error.calledWith('Usage: quire conf delete <key>'))
  t.false(mockConfig.delete.called)
})

test('conf delete should show error for unknown key', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('delete', 'unknownKey', undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.false(mockConfig.delete.called)
})

// =============================================================================
// Reset operation
// =============================================================================

test('conf reset should reset a single key', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('reset', 'logLevel', undefined, {})

  t.true(mockConfig.reset.calledOnce)
  t.true(mockConfig.reset.calledWith('logLevel'))
  t.true(mockLogger.info.firstCall.args[0].includes('reset to'))
})

test('conf reset should reset all config when no key provided', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('reset', undefined, undefined, {})

  t.true(mockConfig.clear.calledOnce)
  t.true(mockLogger.info.calledWith('Configuration reset to defaults'))
})

test('conf reset should show error for unknown key', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('reset', 'unknownKey', undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.false(mockConfig.reset.called)
})

// =============================================================================
// Path operation
// =============================================================================

test('conf path should show config file path', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('path', undefined, undefined, {})

  t.true(mockLogger.info.calledOnce)
  t.true(mockLogger.info.calledWith('/mock/config/path'))
})

// =============================================================================
// Invalid operation
// =============================================================================

test('conf should show error for unknown operation', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('unknownOp', undefined, undefined, {})

  t.true(mockLogger.error.calledOnce)
  t.true(mockLogger.error.calledWith('Unknown operation: unknownOp'))
  t.true(mockLogger.info.calledOnce)
  t.true(mockLogger.info.firstCall.args[0].includes('Valid operations:'))
})

// =============================================================================
// JSON output
// =============================================================================

test.serial('conf --json should output raw JSON of all config', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, { json: true })

  t.true(consoleLogStub.calledOnce)
  const output = JSON.parse(consoleLogStub.firstCall.args[0])
  t.is(output.logLevel, 'info')
  t.is(output.quireVersion, '1.0.0')
  t.false(mockLogger.info.called, 'logger.info should not be called in JSON mode')
})

test.serial('conf --json should not include descriptions or headers', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, { json: true })

  const raw = consoleLogStub.firstCall.args[0]
  t.false(raw.includes('quire-cli configuration'), 'JSON output should not contain header text')
  t.false(raw.includes('Use "quire settings'), 'JSON output should not contain help hint')
})

test.serial('conf --json should exclude __internal__ keys by default', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, { json: true })

  const output = JSON.parse(consoleLogStub.firstCall.args[0])
  t.false('__internal__secretKey' in output, 'JSON output should not include __internal__ keys')
  t.is(output.logLevel, 'info', 'non-internal keys should still be present')
})

test.serial('conf --json --debug should include __internal__ keys', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action(undefined, undefined, undefined, { json: true, debug: true })

  const output = JSON.parse(consoleLogStub.firstCall.args[0])
  t.is(output.__internal__secretKey, 'hidden-value', '__internal__ keys should be included with --debug')
  t.is(output.logLevel, 'info')
})

test.serial('conf get --json should output single value as JSON', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('get', 'logLevel', undefined, { json: true })

  t.true(consoleLogStub.calledOnce)
  t.is(consoleLogStub.firstCall.args[0], '"info"')
  t.false(mockLogger.info.called, 'logger.info should not be called in JSON mode')
})

test.serial('conf get --json should output boolean value as JSON', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('get', 'logShowLevel', undefined, { json: true })

  t.true(consoleLogStub.calledOnce)
  t.is(consoleLogStub.firstCall.args[0], 'false')
})

test.serial('conf get --json should output undefined as JSON for unset key', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  // Add a key that returns undefined
  mockConfig.store.missingKey = undefined
  mockConfig.get = (key) => mockConfig.store[key]

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action('get', 'logLevel', undefined, { json: true })

  t.true(consoleLogStub.calledOnce)
})

// =============================================================================
// Debug output
// =============================================================================

test('conf command logs debug info with operation, key, value, and options', async (t) => {
  const { sandbox, mockLogger, mockConfig } = t.context

  const mockDebug = sandbox.stub()

  const { default: ConfCommand } = await esmock('./config.js', {}, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new ConfCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = mockDebug

  await command.action('set', 'logLevel', 'debug', { someOption: true })

  t.true(mockDebug.called)
  t.true(mockDebug.calledWith(
    'called with operation=%s key=%s value=%s options=%O',
    'set',
    'logLevel',
    'debug',
    { someOption: true }
  ))
})
