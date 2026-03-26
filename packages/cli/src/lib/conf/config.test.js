import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * Configuration Module Integration Tests
 *
 * Tests the Quire CLI configuration module behavior with mocked dependencies.
 * Uses esmock to isolate the module from the actual Conf library and filesystem.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// Configuration instantiation tests
// ─────────────────────────────────────────────────────────────────────────────

test('config is created with correct project name and version', async (t) => {
  const { sandbox } = t.context

  let capturedOptions = null
  const MockConf = sandbox.stub().callsFake(function (options) {
    capturedOptions = options
    return {
      get: sandbox.stub(),
      set: sandbox.stub()
    }
  })

  await esmock('./config.js', {
    conf: { default: MockConf },
    '#src/packageConfig.js': { name: '@thegetty/quire-cli', version: '1.0.0' }
  })

  t.true(MockConf.calledOnce)
  t.is(capturedOptions.projectName, '@thegetty/quire-cli')
  t.is(capturedOptions.projectVersion, '1.0.0')
  t.is(capturedOptions.projectSuffix, '')
})

test('config is created with correct options', async (t) => {
  const { sandbox } = t.context

  let capturedOptions = null
  const MockConf = sandbox.stub().callsFake(function (options) {
    capturedOptions = options
    return {
      get: sandbox.stub(),
      set: sandbox.stub()
    }
  })

  await esmock('./config.js', {
    conf: { default: MockConf },
    '#src/packageConfig.js': { name: 'test', version: '1.0.0' }
  })

  t.true(capturedOptions.clearInvalidConfig)
  t.true(capturedOptions.watch)
  t.is(typeof capturedOptions.beforeEachMigration, 'function')
})

test('config passes defaults to Conf constructor', async (t) => {
  const { sandbox } = t.context

  let capturedOptions = null
  const MockConf = sandbox.stub().callsFake(function (options) {
    capturedOptions = options
    return {
      get: sandbox.stub(),
      set: sandbox.stub()
    }
  })

  const mockDefaults = {
    logLevel: 'debug',
    quireVersion: '2.0.0'
  }

  await esmock('./config.js', {
    conf: { default: MockConf },
    './defaults.js': { default: mockDefaults },
    '#src/packageConfig.js': { name: 'test', version: '1.0.0' }
  })

  t.deepEqual(capturedOptions.defaults, mockDefaults)
})

test('config passes schema to Conf constructor', async (t) => {
  const { sandbox } = t.context

  let capturedOptions = null
  const MockConf = sandbox.stub().callsFake(function (options) {
    capturedOptions = options
    return {
      get: sandbox.stub(),
      set: sandbox.stub()
    }
  })

  const mockSchema = {
    logLevel: { type: 'string' },
    quireVersion: { type: 'string' }
  }

  await esmock('./config.js', {
    conf: { default: MockConf },
    './schema.js': { default: mockSchema },
    '#src/packageConfig.js': { name: 'test', version: '1.0.0' }
  })

  t.deepEqual(capturedOptions.schema, mockSchema)
})

test('config passes migrations to Conf constructor', async (t) => {
  const { sandbox } = t.context

  let capturedOptions = null
  const MockConf = sandbox.stub().callsFake(function (options) {
    capturedOptions = options
    return {
      get: sandbox.stub(),
      set: sandbox.stub()
    }
  })

  const mockMigrations = {
    '1.0.0': () => {},
    '2.0.0': () => {}
  }

  await esmock('./config.js', {
    conf: { default: MockConf },
    './migrations.js': { default: mockMigrations },
    '#src/packageConfig.js': { name: 'test', version: '1.0.0' }
  })

  t.deepEqual(capturedOptions.migrations, mockMigrations)
})

// ─────────────────────────────────────────────────────────────────────────────
// Migration callback tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('beforeEachMigration logs migration info', async (t) => {
  const { sandbox } = t.context

  let capturedOptions = null
  const MockConf = sandbox.stub().callsFake(function (options) {
    capturedOptions = options
    return {
      get: sandbox.stub(),
      set: sandbox.stub()
    }
  })

  const consoleInfoStub = sandbox.stub(console, 'info')

  await esmock('./config.js', {
    conf: { default: MockConf },
    '#src/packageConfig.js': { name: 'test', version: '1.0.0' }
  })

  // Call the beforeEachMigration callback
  const mockStore = { get: sandbox.stub(), set: sandbox.stub() }
  const mockContext = { fromVersion: '0.9.0', toVersion: '1.0.0' }
  capturedOptions.beforeEachMigration(mockStore, mockContext)

  t.true(consoleInfoStub.calledOnce)
  t.true(consoleInfoStub.firstCall.args[0].includes('0.9.0'))
  t.true(consoleInfoStub.firstCall.args[0].includes('1.0.0'))
  t.true(consoleInfoStub.firstCall.args[0].includes('Migrating'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Module export tests
// ─────────────────────────────────────────────────────────────────────────────

test('config module exports Conf instance as default', async (t) => {
  const { sandbox } = t.context

  const mockInstance = {
    get: sandbox.stub().returns('value'),
    set: sandbox.stub(),
    has: sandbox.stub().returns(true),
    delete: sandbox.stub()
  }

  const MockConf = sandbox.stub().returns(mockInstance)

  const config = await esmock('./config.js', {
    conf: { default: MockConf },
    '#src/packageConfig.js': { name: 'test', version: '1.0.0' }
  })

  t.is(config.default, mockInstance)
})

// ─────────────────────────────────────────────────────────────────────────────
// Default values tests
// ─────────────────────────────────────────────────────────────────────────────

test('defaults module exports expected configuration keys', async (t) => {
  const defaults = await import('./defaults.js')

  t.true('logLevel' in defaults.default)
  t.true('projectTemplate' in defaults.default)
  t.true('quire11tyPath' in defaults.default)
  t.true('quireVersion' in defaults.default)
  t.true('updateChannel' in defaults.default)
  t.true('updateInterval' in defaults.default)
  t.true('versionFile' in defaults.default)
})

test('defaults module has reasonable default values', async (t) => {
  const defaults = await import('./defaults.js')

  t.is(defaults.default.logLevel, 'info')
  t.is(defaults.default.quireVersion, 'latest')
  t.is(defaults.default.versionFile, '.quire')
  t.true(defaults.default.projectTemplate.includes('github.com'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Schema tests
// ─────────────────────────────────────────────────────────────────────────────

test('schema module defines types for all default keys', async (t) => {
  const schema = await import('./schema.js')
  const defaults = await import('./defaults.js')

  const schemaKeys = Object.keys(schema.default)
  const defaultKeys = Object.keys(defaults.default)

  // All default keys should have schema definitions
  for (const key of defaultKeys) {
    t.true(schemaKeys.includes(key), `Schema should define ${key}`)
  }
})

test('schema module defines valid types for all properties', async (t) => {
  const schema = await import('./schema.js')

  const validTypes = ['string', 'boolean', 'number', 'object', 'array']
  for (const [key, value] of Object.entries(schema.default)) {
    t.true(validTypes.includes(value.type), `${key} should have a valid type`)
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Migrations tests
// ─────────────────────────────────────────────────────────────────────────────

test('migrations module exports migration functions', async (t) => {
  const migrations = await import('./migrations.js')

  t.is(typeof migrations.default, 'object')
  t.true('1.0.0' in migrations.default)
})

test('migrations 1.0.0 sets updateChannel', async (t) => {
  const { sandbox } = t.context

  const migrations = await import('./migrations.js')

  const mockStore = {
    get: sandbox.stub(),
    set: sandbox.stub()
  }

  migrations.default['1.0.0'](mockStore)

  t.true(mockStore.set.calledOnce)
  t.true(mockStore.set.calledWith('updateChannel', 'latest'))
})
