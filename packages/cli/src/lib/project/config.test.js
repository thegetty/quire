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
})

test.afterEach.always((t) => {
  // Restore all mocks
  if (t.context.sandbox) {
    t.context.sandbox.restore()
  }

  // Clear in-memory file system
  t.context.vol.reset()
})

test('loadProjectConfig should log an error and exit when config file does not exist', async (t) => {
  const { sandbox, fs, vol } = t.context

  // Setup empty directory
  vol.fromJSON({
    '/project/content/_data/.gitkeep': ''
  })

  const mockLogger = { error: sandbox.stub() }
  // Stub process.exit to throw so execution stops (mimics real exit behavior)
  const exitError = new Error('process.exit called')
  const mockExit = sandbox.stub(process, 'exit').throws(exitError)

  const { loadProjectConfig } = await esmock('./config.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p) => fs.readFileSync(p)
    },
    './paths.js': {
      default: {
        getProjectRoot: () => '/project'
      }
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    }
  })

  await t.throwsAsync(() => loadProjectConfig('/project'), { message: 'process.exit called' })

  t.true(mockLogger.error.called, 'should log error')
  t.true(mockLogger.error.firstCall.args[0].includes('config.yaml'), 'error should include config path')
  t.true(mockLogger.error.firstCall.args[0].includes('Quire project'), 'error should mention Quire')
  t.true(mockExit.calledWith(1), 'should exit with code 1')
})

test('loadProjectConfig should load and parse YAML config file', async (t) => {
  const { fs, vol } = t.context

  // Setup config file
  vol.fromJSON({
    '/project/content/_data/config.yaml': 'title: Test Project\nauthor: Test Author'
  })

  // Mock fs-extra to use memfs
  const { loadProjectConfig } = await esmock('./config.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p) => fs.readFileSync(p)
    },
    './paths.js': {
      default: {
        getProjectRoot: () => '/project'
      }
    }
  })

  const result = await loadProjectConfig('/project')

  t.truthy(result, 'should return config object')
  t.is(result.title, 'Test Project', 'should parse title')
  t.is(result.author, 'Test Author', 'should parse author')
})

test('loadProjectConfig should load PDF configuration', async (t) => {
  const { fs, vol } = t.context

  // Setup config file with PDF settings
  vol.fromJSON({
    '/project/content/_data/config.yaml': `title: Test Project
pdf:
  filename: test-book
  outputDir: _pdf`
  })

  // Mock fs-extra to use memfs
  const { loadProjectConfig } = await esmock('./config.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p) => fs.readFileSync(p)
    },
    './paths.js': {
      default: {
        getProjectRoot: () => '/project'
      }
    }
  })

  const result = await loadProjectConfig('/project')

  t.truthy(result.pdf, 'should have pdf config')
  t.is(result.pdf.filename, 'test-book', 'should parse pdf filename')
  t.is(result.pdf.outputDir, '_pdf', 'should parse pdf outputDir')
})

test('loadProjectConfig should use default project root when not provided', async (t) => {
  const { fs, vol } = t.context

  // Setup config file
  vol.fromJSON({
    '/default/project/content/_data/config.yaml': 'title: Default Project'
  })

  // Mock fs-extra to use memfs
  const { loadProjectConfig } = await esmock('./config.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p) => fs.readFileSync(p)
    },
    './paths.js': {
      default: {
        getProjectRoot: () => '/default/project'
      }
    }
  })

  const result = await loadProjectConfig()

  t.is(result.title, 'Default Project', 'should use default project root')
})
