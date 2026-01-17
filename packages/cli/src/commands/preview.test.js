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

  // Setup mock directory structure
  t.context.vol.fromJSON({
    '/project/content/_data/config.yaml': 'title: Test Project',
    '/project/content/index.md': '# Welcome',
    '/project/package.json': JSON.stringify({ name: 'test-project' })
  })

  t.context.projectRoot = '/project'

  // Stub console methods to suppress output during tests
  // Create mock logger (no global console stubbing needed!)
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('preview command should call eleventy CLI serve with default options', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    serve: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    serve: sandbox.stub().resolves()
  }

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const PreviewCommand = await esmock('./preview.js', {
    '#lib/11ty/index.js': {
      api: mockEleventyApi,
      cli: mockEleventyCli
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new PreviewCommand()
  command.name = sandbox.stub().returns('preview')

  // Run preAction
  command.preAction(command)

  // Run action with default options (uses cli by default)
  await command.action({ '11ty': 'cli', port: 8080 }, command)

  t.true(mockTestcwd.called, 'testcwd should be called in preAction')
  t.true(mockEleventyCli.serve.called, 'eleventy CLI serve should be called')
  t.false(mockEleventyApi.serve.called, 'eleventy API serve should not be called')
})

test('preview command should call eleventy API when 11ty option is "api"', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    serve: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    serve: sandbox.stub().resolves()
  }

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const PreviewCommand = await esmock('./preview.js', {
    '#lib/11ty/index.js': {
      api: mockEleventyApi,
      cli: mockEleventyCli
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new PreviewCommand()
  command.name = sandbox.stub().returns('preview')

  // Run action with api option
  await command.action({ '11ty': 'api', port: 8080 }, command)

  t.false(mockEleventyCli.serve.called, 'eleventy CLI serve should not be called')
  t.true(mockEleventyApi.serve.called, 'eleventy API serve should be called')
})

test('preview command should pass port option to eleventy serve', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    serve: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    serve: sandbox.stub().resolves()
  }

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const PreviewCommand = await esmock('./preview.js', {
    '#lib/11ty/index.js': {
      api: mockEleventyApi,
      cli: mockEleventyCli
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new PreviewCommand()
  command.name = sandbox.stub().returns('preview')

  const options = { '11ty': 'cli', port: 3000 }

  // Run action with custom port
  await command.action(options, command)

  t.true(mockEleventyCli.serve.calledWith(options), 'eleventy CLI serve should be called with port option')
})

test('preview command should pass quiet and verbose options', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    serve: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    serve: sandbox.stub().resolves()
  }

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const PreviewCommand = await esmock('./preview.js', {
    '#lib/11ty/index.js': {
      api: mockEleventyApi,
      cli: mockEleventyCli
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new PreviewCommand()
  command.name = sandbox.stub().returns('preview')

  const options = { '11ty': 'cli', quiet: true, verbose: false, port: 8080 }

  // Run action with quiet and verbose options
  await command.action(options, command)

  t.true(mockEleventyCli.serve.calledWith(options), 'eleventy CLI serve should be called with all options')
})

test('preview command should call testcwd in preAction', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock eleventy modules
  const mockEleventyCli = {
    serve: sandbox.stub().resolves({ exitCode: 0 })
  }

  const mockEleventyApi = {
    serve: sandbox.stub().resolves()
  }

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const PreviewCommand = await esmock('./preview.js', {
    '#lib/11ty/index.js': {
      api: mockEleventyApi,
      cli: mockEleventyCli
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new PreviewCommand()
  command.name = sandbox.stub().returns('preview')

  // Run preAction
  command.preAction(command)

  t.true(mockTestcwd.called, 'testcwd should be called in preAction')
  t.true(mockTestcwd.calledWith(command), 'testcwd should be called with command object')
})
