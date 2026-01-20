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
    '/project/content/index.md': '# Quire Test Project',
    '/project/package.json': JSON.stringify({ name: 'test-project' })
  })

  t.context.projectRoot = '/project'

  // Create mock logger (no global console stubbing needed!)
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }

  // Create mock reporter
  t.context.mockReporter = {
    configure: t.context.sandbox.stub().returnsThis(),
    start: t.context.sandbox.stub().returnsThis(),
    update: t.context.sandbox.stub().returnsThis(),
    succeed: t.context.sandbox.stub().returnsThis(),
    fail: t.context.sandbox.stub().returnsThis(),
    stop: t.context.sandbox.stub().returnsThis(),
  }
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('build command should call eleventy CLI with default options', async (t) => {
  const { sandbox, fs, mockLogger, mockReporter } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    build: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    build: sandbox.stub().resolves()
  }

  // Mock clean helper
  const mockClean = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const BuildCommand = await esmock('./build.js', {
    '#lib/11ty/index.js': {
      api: mockEleventyApi,
      cli: mockEleventyCli
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        toObject: () => ({ output: '_site' })
      }
    },
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs
  })

  const command = new BuildCommand()
  command.name = sandbox.stub().returns('build')
  command.opts = sandbox.stub().returns({})

  // Run preAction
  command.preAction(command)

  // Run action with default options (uses cli by default)
  await command.action({ '11ty': 'cli' }, command)

  t.true(mockTestcwd.called, 'testcwd should be called in preAction')
  t.true(mockClean.called, 'clean should be called in preAction')
  t.false(mockEleventyApi.build.called, 'eleventy API build should not be called')
  t.true(mockEleventyCli.build.called, 'eleventy CLI build should be called')
  t.true(mockReporter.start.called, 'reporter.start should be called')
  t.true(mockReporter.succeed.called, 'reporter.succeed should be called')
})

test('build command should call eleventy API when 11ty option is "api"', async (t) => {
  const { sandbox, fs, mockLogger, mockReporter } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    build: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    build: sandbox.stub().resolves()
  }

  // Mock clean helper
  const mockClean = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const BuildCommand = await esmock('./build.js', {
    '#lib/11ty/index.js': {
      cli: mockEleventyCli,
      api: mockEleventyApi
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        toObject: () => ({ output: '_site' })
      }
    },
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs
  })

  const command = new BuildCommand()
  command.name = sandbox.stub().returns('build')

  // Run action with api option
  await command.action({ '11ty': 'api' }, command)

  t.false(mockEleventyCli.build.called, 'eleventy CLI build should not be called')
  t.true(mockEleventyApi.build.called, 'eleventy API build should be called')
})

test('build command should call clean with correct parameters in preAction', async (t) => {
  const { sandbox, fs, mockLogger, mockReporter } = t.context

  // Mock eleventy modules
  const mockEleventyCli = {
    build: sandbox.stub().resolves({ exitCode: 0 })
  }

  const mockEleventyApi = {
    build: sandbox.stub().resolves()
  }

  // Mock clean helper
  const mockClean = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const BuildCommand = await esmock('./build.js', {
    '#lib/11ty/index.js': {
      cli: mockEleventyCli,
      api: mockEleventyApi
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        toObject: () => ({ output: '_site' })
      }
    },
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs
  })

  const command = new BuildCommand()
  command.name = sandbox.stub().returns('build')
  const options = { verbose: true }
  command.opts = sandbox.stub().returns(options)

  // Run preAction
  command.preAction(command)

  t.true(mockClean.called, 'clean should be called')
  t.true(mockClean.calledWith('/project', { output: '_site' }, options), 'clean should be called with correct parameters')
})

test('build command should pass options to eleventy build', async (t) => {
  const { sandbox, fs, mockLogger, mockReporter } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    build: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    build: sandbox.stub().resolves()
  }

  // Mock clean helper
  const mockClean = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const BuildCommand = await esmock('./build.js', {
    '#lib/11ty/index.js': {
      cli: mockEleventyCli,
      api: mockEleventyApi
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        toObject: () => ({ output: '_site' })
      }
    },
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs
  })

  const command = new BuildCommand()
  command.name = sandbox.stub().returns('build')

  const options = { '11ty': 'cli', verbose: true, quiet: false }

  // Run action with options
  await command.action(options, command)

  t.true(mockEleventyCli.build.calledWith(options), 'eleventy CLI build should be called with options')
})

test('build command should call reporter.fail when build fails', async (t) => {
  const { sandbox, fs, mockLogger, mockReporter } = t.context

  const buildError = new Error('Build failed')

  // Mock eleventy API module to throw error
  const mockEleventyApi = {
    build: sandbox.stub().rejects(buildError)
  }

  // Mock eleventy CLI module
  const mockEleventyCli = {
    build: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock clean helper
  const mockClean = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const BuildCommand = await esmock('./build.js', {
    '#lib/11ty/index.js': {
      api: mockEleventyApi,
      cli: mockEleventyCli
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        toObject: () => ({ output: '_site' })
      }
    },
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs
  })

  const command = new BuildCommand()
  command.name = sandbox.stub().returns('build')

  // Run action and expect it to throw
  await t.throwsAsync(() => command.action({ '11ty': 'api' }, command), { message: 'Build failed' })

  t.true(mockReporter.start.called, 'reporter.start should be called')
  t.true(mockReporter.fail.called, 'reporter.fail should be called on error')
  t.false(mockReporter.succeed.called, 'reporter.succeed should not be called on error')
})

test('build command should configure reporter with quiet option', async (t) => {
  const { sandbox, fs, mockLogger, mockReporter } = t.context

  // Mock eleventy CLI module
  const mockEleventyCli = {
    build: sandbox.stub().resolves({ exitCode: 0 })
  }

  // Mock eleventy API module
  const mockEleventyApi = {
    build: sandbox.stub().resolves()
  }

  // Mock clean helper
  const mockClean = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const BuildCommand = await esmock('./build.js', {
    '#lib/11ty/index.js': {
      cli: mockEleventyCli,
      api: mockEleventyApi
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        toObject: () => ({ output: '_site' })
      }
    },
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs
  })

  const command = new BuildCommand()
  command.name = sandbox.stub().returns('build')

  const options = { '11ty': 'api', quiet: true }

  // Run action with quiet option
  await command.action(options, command)

  t.true(
    mockReporter.configure.calledWith(sinon.match({ quiet: true })),
    'reporter.configure should be called with quiet option'
  )
})
