import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * Eleventy Module Integration Tests
 *
 * Tests the Eleventy façade module behavior with mocked dependencies.
 * Uses esmock to replace execa and paths for isolated testing.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// CLI module tests
// ─────────────────────────────────────────────────────────────────────────────

test('cli.build() runs eleventy with correct arguments', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() },
    exitCode: 0
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '3.0.0' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.build({})

  t.true(mockExeca.calledOnce)
  const [cmd, args, options] = mockExeca.firstCall.args
  t.is(cmd, 'node')
  t.true(args.some(arg => arg.includes('cmd.cjs')))
  t.true(args.some(arg => arg.includes('--config=')))
  t.true(args.some(arg => arg.includes('--input=')))
  t.true(args.some(arg => arg.includes('--output=')))
  t.is(options.env.ELEVENTY_ENV, 'production')
})

test('cli.build() passes quiet option when specified', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() },
    exitCode: 0
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '3.0.0' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.build({ quiet: true })

  const [, args] = mockExeca.firstCall.args
  t.true(args.includes('--quiet'))
})

test('cli.build() passes verbose option when specified', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() },
    exitCode: 0
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '3.0.0' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.build({ verbose: true })

  const [, args] = mockExeca.firstCall.args
  t.true(args.includes('--verbose'))
})

test('cli.build() sets DEBUG environment variable when debug option is true', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() },
    exitCode: 0
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '3.0.0' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.build({ debug: true })

  const [, , options] = mockExeca.firstCall.args
  t.is(options.env.DEBUG, 'Eleventy*')
})

test('cli.build() passes dryrun option when specified', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() },
    exitCode: 0
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '3.0.0' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.build({ dryRun: true })

  const [, args] = mockExeca.firstCall.args
  t.true(args.includes('--dryrun'))
})

test('cli.serve() runs eleventy with --serve flag', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() }
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '3.0.0' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.serve({})

  const [, args, options] = mockExeca.firstCall.args
  t.true(args.includes('--serve'))
  t.is(options.env.ELEVENTY_ENV, 'development')
})

test('cli.serve() passes port option when specified', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() }
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '3.0.0' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.serve({ port: 8080 })

  const [, args] = mockExeca.firstCall.args
  t.true(args.includes('--port=8080'))
})

test('cli uses cmd.js for Eleventy v2', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().returns({
    all: { pipe: sandbox.stub() },
    exitCode: 0
  })

  const mockPaths = {
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    toObject: () => ({})
  }

  const mockFs = {
    readFileSync: sandbox.stub().returns(JSON.stringify({ version: '2.0.1' }))
  }

  const cli = await esmock('./cli.js', {
    execa: { execa: mockExeca },
    '#lib/project/index.js': { default: mockPaths },
    'node:fs': mockFs
  })

  await cli.build({})

  const [, args] = mockExeca.firstCall.args
  t.true(args.some(arg => arg.includes('cmd.js')))
  t.false(args.some(arg => arg.includes('cmd.cjs')))
})

// ─────────────────────────────────────────────────────────────────────────────
// API module tests
// ─────────────────────────────────────────────────────────────────────────────

test('configureEleventyEnv sets required environment variables', async (t) => {
  const { sandbox } = t.context

  // Save original env
  const originalEnv = { ...process.env }

  const mockPaths = {
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts'
  }

  const { configureEleventyEnv } = await esmock('./api.js', {
    '#lib/project/index.js': { default: mockPaths },
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() }
  })

  configureEleventyEnv({ mode: 'production', debug: false })

  t.is(process.env.ELEVENTY_DATA, '/project/content/_data')
  t.is(process.env.ELEVENTY_INCLUDES, '/project/_includes')
  t.is(process.env.ELEVENTY_LAYOUTS, '/project/_layouts')
  t.is(process.env.ELEVENTY_ENV, 'production')

  // Restore original env
  Object.assign(process.env, originalEnv)
})

test('configureEleventyEnv sets DEBUG when debug is true', async (t) => {
  const { sandbox } = t.context

  const originalDebug = process.env.DEBUG

  const mockPaths = {
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts'
  }

  const { configureEleventyEnv } = await esmock('./api.js', {
    '#lib/project/index.js': { default: mockPaths },
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() }
  })

  configureEleventyEnv({ mode: 'development', debug: true })

  t.is(process.env.DEBUG, 'Eleventy*')
  t.is(process.env.ELEVENTY_ENV, 'development')

  // Restore
  if (originalDebug !== undefined) {
    process.env.DEBUG = originalDebug
  } else {
    delete process.env.DEBUG
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Index module exports tests
// ─────────────────────────────────────────────────────────────────────────────

test('index exports eleventy singleton with build and serve methods', async (t) => {
  const { sandbox } = t.context

  const mockPaths = {
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    toObject: () => ({})
  }

  const eleventy = await esmock('./index.js', {
    '#lib/project/index.js': {
      default: mockPaths,
      Paths: class MockPaths {},
      loadProjectConfig: sandbox.stub()
    },
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() }
  })

  t.is(typeof eleventy.default.build, 'function')
  t.is(typeof eleventy.default.serve, 'function')
  t.truthy(eleventy.default.paths)
})

test('index exports api object for backwards compatibility', async (t) => {
  const { sandbox } = t.context

  const mockPaths = {
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    toObject: () => ({})
  }

  const { api } = await esmock('./index.js', {
    '#lib/project/index.js': {
      default: mockPaths,
      Paths: class MockPaths {},
      loadProjectConfig: sandbox.stub()
    },
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() }
  })

  t.is(typeof api.build, 'function')
  t.is(typeof api.serve, 'function')
})

test('index exports cli object', async (t) => {
  const { sandbox } = t.context

  const mockPaths = {
    getProjectRoot: () => '/project',
    getDataDir: () => '/project/content/_data',
    getIncludesDir: () => '/project/_includes',
    getLayoutsDir: () => '/project/_layouts',
    getConfigPath: () => '/project/.eleventy.js',
    getEleventyRoot: () => '/project',
    getInputDir: () => '/project/content',
    getOutputDir: () => '/project/_site',
    toObject: () => ({})
  }

  const { cli } = await esmock('./index.js', {
    '#lib/project/index.js': {
      default: mockPaths,
      Paths: class MockPaths {},
      loadProjectConfig: sandbox.stub()
    },
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() }
  })

  t.is(typeof cli.build, 'function')
  t.is(typeof cli.serve, 'function')
})
