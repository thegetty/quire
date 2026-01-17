import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'
import createLogger, { logger, LOG_LEVELS, LOG_LEVEL_ENV_VAR } from './index.js'

/**
 * Logger Module Integration Tests
 *
 * Tests the actual logging behavior including output formatting and level filtering.
 *
 * Note: loglevel captures console methods at module load time, so we can't stub
 * console.log directly. Instead, we test the logger's behavior through its API
 * and verify level filtering works correctly.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// Log method invocation tests
// ─────────────────────────────────────────────────────────────────────────────

test('logger methods are callable without error', (t) => {
  const log = createLogger('test:callable', 'silent') // Silent to avoid output

  t.notThrows(() => log.trace('trace message'))
  t.notThrows(() => log.debug('debug message'))
  t.notThrows(() => log.info('info message'))
  t.notThrows(() => log.warn('warn message'))
  t.notThrows(() => log.error('error message'))
})

test('logger methods accept multiple arguments', (t) => {
  const log = createLogger('test:multiarg', 'silent')

  t.notThrows(() => log.info('message', 'arg1', 'arg2'))
  t.notThrows(() => log.info('message', { key: 'value' }))
  t.notThrows(() => log.info('message', 123, true, null))
})

test('logger methods accept no arguments', (t) => {
  const log = createLogger('test:noarg', 'silent')

  t.notThrows(() => log.info())
  t.notThrows(() => log.error())
})

// ─────────────────────────────────────────────────────────────────────────────
// Level filtering behavior tests
// ─────────────────────────────────────────────────────────────────────────────

test('logger at trace level has getLevel() return 0', (t) => {
  const log = createLogger('test:trace', 'trace')
  t.is(log.getLevel(), LOG_LEVELS.trace)
})

test('logger at debug level has getLevel() return 1', (t) => {
  const log = createLogger('test:debug', 'debug')
  t.is(log.getLevel(), LOG_LEVELS.debug)
})

test('logger at info level has getLevel() return 2', (t) => {
  const log = createLogger('test:info', 'info')
  t.is(log.getLevel(), LOG_LEVELS.info)
})

test('logger at warn level has getLevel() return 3', (t) => {
  const log = createLogger('test:warn', 'warn')
  t.is(log.getLevel(), LOG_LEVELS.warn)
})

test('logger at error level has getLevel() return 4', (t) => {
  const log = createLogger('test:error', 'error')
  t.is(log.getLevel(), LOG_LEVELS.error)
})

test('logger at silent level has getLevel() return 5', (t) => {
  const log = createLogger('test:silent', 'silent')
  t.is(log.getLevel(), LOG_LEVELS.silent)
})

// ─────────────────────────────────────────────────────────────────────────────
// Runtime level change tests
// ─────────────────────────────────────────────────────────────────────────────

test('setLevel changes getLevel() return value', (t) => {
  const log = createLogger('test:setlevel', 'info')
  t.is(log.getLevel(), LOG_LEVELS.info)

  log.setLevel('debug')
  t.is(log.getLevel(), LOG_LEVELS.debug)

  log.setLevel('error')
  t.is(log.getLevel(), LOG_LEVELS.error)

  log.setLevel('silent')
  t.is(log.getLevel(), LOG_LEVELS.silent)
})

test('setLevel accepts numeric values', (t) => {
  const log = createLogger('test:numeric', 'info')

  log.setLevel(0)
  t.is(log.getLevel(), 0)

  log.setLevel(4)
  t.is(log.getLevel(), 4)
})

test('setLevel with invalid string defaults to info', (t) => {
  const log = createLogger('test:invalid', 'debug')
  t.is(log.getLevel(), LOG_LEVELS.debug)

  log.setLevel('not-a-level')
  t.is(log.getLevel(), LOG_LEVELS.info)
})

// ─────────────────────────────────────────────────────────────────────────────
// Independent instance tests
// ─────────────────────────────────────────────────────────────────────────────

test('multiple loggers maintain independent levels', (t) => {
  const log1 = createLogger('independent:one', 'debug')
  const log2 = createLogger('independent:two', 'error')

  t.is(log1.getLevel(), LOG_LEVELS.debug)
  t.is(log2.getLevel(), LOG_LEVELS.error)

  log1.setLevel('warn')

  t.is(log1.getLevel(), LOG_LEVELS.warn)
  t.is(log2.getLevel(), LOG_LEVELS.error) // Unchanged
})

// ─────────────────────────────────────────────────────────────────────────────
// Singleton behavior tests
// ─────────────────────────────────────────────────────────────────────────────

test('default singleton is functional', (t) => {
  t.notThrows(() => logger.info('singleton test'))
  t.is(typeof logger.getLevel(), 'number')
})

// ─────────────────────────────────────────────────────────────────────────────
// Console output tests with level labels (logShowLevel: true)
// ─────────────────────────────────────────────────────────────────────────────

test.serial('error level outputs to console.error with level label when configured', async (t) => {
  const { sandbox } = t.context
  const consoleErrorStub = sandbox.stub(console, 'error')

  // Mock config to show level labels
  const mockConfig = {
    get: sandbox.stub().callsFake((key) => ({
      logPrefix: 'quire',
      logPrefixStyle: 'bracket',
      logShowLevel: true,
      logUseColor: false
    })[key])
  }

  const { default: createLoggerMocked } = await esmock('./index.js', {
    '#lib/conf/config.js': { default: mockConfig }
  })

  const log = createLoggerMocked('test:error:output', 'error')
  log.error('Error message')

  t.true(consoleErrorStub.calledOnce)
  const output = consoleErrorStub.firstCall.args.join(' ')
  t.true(output.includes('[quire]'))
  t.true(output.includes('ERROR'))
  t.true(output.includes('Error message'))
})

test.serial('warn level outputs to console.warn with level label when configured', async (t) => {
  const { sandbox } = t.context
  const consoleWarnStub = sandbox.stub(console, 'warn')

  // Mock config to show level labels
  const mockConfig = {
    get: sandbox.stub().callsFake((key) => ({
      logPrefix: 'quire',
      logPrefixStyle: 'bracket',
      logShowLevel: true,
      logUseColor: false
    })[key])
  }

  const { default: createLoggerMocked } = await esmock('./index.js', {
    '#lib/conf/config.js': { default: mockConfig }
  })

  const log = createLoggerMocked('test:warn:output', 'warn')
  log.warn('Warning message')

  t.true(consoleWarnStub.calledOnce)
  const output = consoleWarnStub.firstCall.args.join(' ')
  t.true(output.includes('[quire]'))
  t.true(output.includes('WARN'))
  t.true(output.includes('Warning message'))
})

test.serial('trace level outputs to console.trace with level label when configured', async (t) => {
  const { sandbox } = t.context
  const consoleTraceStub = sandbox.stub(console, 'trace')

  // Mock config to show level labels
  const mockConfig = {
    get: sandbox.stub().callsFake((key) => ({
      logPrefix: 'quire',
      logPrefixStyle: 'bracket',
      logShowLevel: true,
      logUseColor: false
    })[key])
  }

  const { default: createLoggerMocked } = await esmock('./index.js', {
    '#lib/conf/config.js': { default: mockConfig }
  })

  const log = createLoggerMocked('test:trace:output', 'trace')
  log.trace('Trace message')

  t.true(consoleTraceStub.calledOnce)
  const output = consoleTraceStub.firstCall.args.join(' ')
  t.true(output.includes('[quire]'))
  t.true(output.includes('TRACE'))
  t.true(output.includes('Trace message'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Prefix configuration tests
// ─────────────────────────────────────────────────────────────────────────────

test('different prefixes create distinct loggers', (t) => {
  const log1 = createLogger('prefix:alpha', 'debug')
  const log2 = createLogger('prefix:beta', 'warn')

  // Different levels confirm different instances
  t.not(log1.getLevel(), log2.getLevel())
})

test('same prefix returns same underlying loglevel instance', (t) => {
  const log1 = createLogger('same:prefix', 'debug')
  const log2 = createLogger('same:prefix', 'warn')

  // Setting level on one affects the other (same loglevel instance)
  log1.setLevel('error')
  t.is(log1.getLevel(), LOG_LEVELS.error)
  t.is(log2.getLevel(), LOG_LEVELS.error)
})

// ─────────────────────────────────────────────────────────────────────────────
// Edge case tests
// ─────────────────────────────────────────────────────────────────────────────

test('empty prefix throws error (loglevel requirement)', (t) => {
  t.throws(() => createLogger('', 'info'), {
    instanceOf: TypeError,
    message: /supply a name/
  })
})

test('special characters in prefix are allowed', (t) => {
  const log = createLogger('lib:pdf/paged.js', 'info')
  t.notThrows(() => log.info('message'))
})

test('undefined level defaults to info', (t) => {
  const log = createLogger('test:undefined')
  t.is(log.getLevel(), LOG_LEVELS.info)
})

// ─────────────────────────────────────────────────────────────────────────────
// Environment variable tests
// ─────────────────────────────────────────────────────────────────────────────

test('LOG_LEVEL_ENV_VAR constant is exported', (t) => {
  t.is(LOG_LEVEL_ENV_VAR, 'QUIRE_LOG_LEVEL')
})

test.serial('logger reads level from QUIRE_LOG_LEVEL env var', async (t) => {
  const originalEnv = process.env[LOG_LEVEL_ENV_VAR]

  try {
    // Set env var to debug
    process.env[LOG_LEVEL_ENV_VAR] = 'debug'

    // Re-import to get fresh module that reads env var
    // Note: We need to use a unique prefix so loglevel creates a new instance
    const { default: freshCreateLogger } = await import('./index.js?env-debug')
    const log = freshCreateLogger('env:debug:test')

    t.is(log.getLevel(), LOG_LEVELS.debug)
  } finally {
    // Restore original env
    if (originalEnv === undefined) {
      delete process.env[LOG_LEVEL_ENV_VAR]
    } else {
      process.env[LOG_LEVEL_ENV_VAR] = originalEnv
    }
  }
})

test.serial('logger reads error level from QUIRE_LOG_LEVEL env var', async (t) => {
  const originalEnv = process.env[LOG_LEVEL_ENV_VAR]

  try {
    process.env[LOG_LEVEL_ENV_VAR] = 'error'

    const { default: freshCreateLogger } = await import('./index.js?env-error')
    const log = freshCreateLogger('env:error:test')

    t.is(log.getLevel(), LOG_LEVELS.error)
  } finally {
    if (originalEnv === undefined) {
      delete process.env[LOG_LEVEL_ENV_VAR]
    } else {
      process.env[LOG_LEVEL_ENV_VAR] = originalEnv
    }
  }
})

test.serial('explicit level parameter overrides env var', async (t) => {
  const originalEnv = process.env[LOG_LEVEL_ENV_VAR]

  try {
    process.env[LOG_LEVEL_ENV_VAR] = 'error'

    const { default: freshCreateLogger } = await import('./index.js?env-override')
    // Explicitly pass 'debug' which should override env var 'error'
    const log = freshCreateLogger('env:override:test', 'debug')

    t.is(log.getLevel(), LOG_LEVELS.debug)
  } finally {
    if (originalEnv === undefined) {
      delete process.env[LOG_LEVEL_ENV_VAR]
    } else {
      process.env[LOG_LEVEL_ENV_VAR] = originalEnv
    }
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Printf-style string substitution tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('logger supports %s string substitution', async (t) => {
  const { sandbox } = t.context
  const consoleInfoStub = sandbox.stub(console, 'info')

  const mockConfig = {
    get: sandbox.stub().callsFake((key) => ({
      logPrefix: 'quire',
      logPrefixStyle: 'none',
      logShowLevel: false,
      logUseColor: false
    })[key])
  }

  const { default: createLoggerMocked } = await esmock('./index.js', {
    '#lib/conf/config.js': { default: mockConfig }
  })

  const log = createLoggerMocked('test:printf:string', 'info')
  log.info('Hello %s', 'world')

  t.true(consoleInfoStub.calledOnce)
  const output = consoleInfoStub.firstCall.args.join(' ')
  t.true(output.includes('Hello world'))
  t.false(output.includes('%s'))
})

test.serial('logger supports %d number substitution', async (t) => {
  const { sandbox } = t.context
  const consoleInfoStub = sandbox.stub(console, 'info')

  const mockConfig = {
    get: sandbox.stub().callsFake((key) => ({
      logPrefix: 'quire',
      logPrefixStyle: 'none',
      logShowLevel: false,
      logUseColor: false
    })[key])
  }

  const { default: createLoggerMocked } = await esmock('./index.js', {
    '#lib/conf/config.js': { default: mockConfig }
  })

  const log = createLoggerMocked('test:printf:number', 'info')
  log.info('Count: %d', 42)

  t.true(consoleInfoStub.calledOnce)
  const output = consoleInfoStub.firstCall.args.join(' ')
  t.true(output.includes('Count: 42'))
  t.false(output.includes('%d'))
})

test.serial('logger supports %O object substitution', async (t) => {
  const { sandbox } = t.context
  const consoleInfoStub = sandbox.stub(console, 'info')

  const mockConfig = {
    get: sandbox.stub().callsFake((key) => ({
      logPrefix: 'quire',
      logPrefixStyle: 'none',
      logShowLevel: false,
      logUseColor: false
    })[key])
  }

  const { default: createLoggerMocked } = await esmock('./index.js', {
    '#lib/conf/config.js': { default: mockConfig }
  })

  const log = createLoggerMocked('test:printf:object', 'info')
  log.info('Data: %O', { key: 'value' })

  t.true(consoleInfoStub.calledOnce)
  const output = consoleInfoStub.firstCall.args.join(' ')
  t.true(output.includes('key'))
  t.true(output.includes('value'))
  t.false(output.includes('%O'))
})

test.serial('logger supports multiple substitutions', async (t) => {
  const { sandbox } = t.context
  const consoleInfoStub = sandbox.stub(console, 'info')

  const mockConfig = {
    get: sandbox.stub().callsFake((key) => ({
      logPrefix: 'quire',
      logPrefixStyle: 'none',
      logShowLevel: false,
      logUseColor: false
    })[key])
  }

  const { default: createLoggerMocked } = await esmock('./index.js', {
    '#lib/conf/config.js': { default: mockConfig }
  })

  const log = createLoggerMocked('test:printf:multi', 'info')
  log.info('%s is %d years old', 'Alice', 30)

  t.true(consoleInfoStub.calledOnce)
  const output = consoleInfoStub.firstCall.args.join(' ')
  t.true(output.includes('Alice is 30 years old'))
  t.false(output.includes('%s'))
  t.false(output.includes('%d'))
})

test.serial('invalid env var value falls back to info', async (t) => {
  const originalEnv = process.env[LOG_LEVEL_ENV_VAR]

  try {
    process.env[LOG_LEVEL_ENV_VAR] = 'not-a-valid-level'

    const { default: freshCreateLogger } = await import('./index.js?env-invalid')
    const log = freshCreateLogger('env:invalid:test')

    t.is(log.getLevel(), LOG_LEVELS.info)
  } finally {
    if (originalEnv === undefined) {
      delete process.env[LOG_LEVEL_ENV_VAR]
    } else {
      process.env[LOG_LEVEL_ENV_VAR] = originalEnv
    }
  }
})
