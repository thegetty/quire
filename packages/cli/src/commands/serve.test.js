import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

/**
 * Helper to create mock paths object with getSitePath
 */
const createMockPaths = (projectRoot = '/test/project') => ({
  getProjectRoot: () => projectRoot,
  getSitePath: () => `${projectRoot}/_site`
})

/**
 * Helper to create mock reporter
 */
const createMockReporter = (sandbox) => ({
  configure: sandbox.stub().returnsThis(),
  start: sandbox.stub().returnsThis(),
  update: sandbox.stub().returnsThis(),
  succeed: sandbox.stub().returnsThis(),
  fail: sandbox.stub().returnsThis(),
  info: sandbox.stub().returnsThis(),
  detail: sandbox.stub().returnsThis(),
  stop: sandbox.stub().returnsThis()
})

test('serve command should throw error when build output is missing', async (t) => {
  const { sandbox } = t.context

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => false
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  const error = await t.throwsAsync(() => command.action({ port: 8080 }, command))

  t.is(error.code, 'BUILD_OUTPUT_MISSING', 'should throw BUILD_OUTPUT_MISSING error')
  t.regex(error.message, /build output not found/, 'error should mention build output not found')
})

test('serve command should run build first when --build flag is set and output missing', async (t) => {
  const { sandbox } = t.context

  const mockBuild = sandbox.stub().resolves()
  const mockReporter = createMockReporter(sandbox)
  let buildCalled = false

  // Mock serve façade that rejects to end test
  const mockServe = sandbox.stub().rejects(new Error('Test close'))

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => {
        // Return false first (before build), true after build
        if (!buildCalled) return false
        return true
      }
    },
    '#lib/11ty/index.js': {
      default: {
        build: async (opts) => {
          buildCalled = true
          return mockBuild(opts)
        }
      }
    },
    '#lib/server/index.js': {
      serve: mockServe
    },
    '#lib/process/manager.js': {
      default: {
        onShutdown: sandbox.stub(),
        onShutdownComplete: sandbox.stub()
      }
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  // This will fail with our mock error, but build should have been called
  await t.throwsAsync(() => command.action({ port: 8080, build: true, quiet: true }, command))

  t.true(mockBuild.called, 'build should be called when --build flag is set')
  t.true(mockReporter.start.called, 'reporter.start should be called for build')
  t.true(mockReporter.succeed.called, 'reporter.succeed should be called after build')
})

test('serve command should not run build when --build flag not set', async (t) => {
  const { sandbox } = t.context

  const mockBuild = sandbox.stub().resolves()

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => false
    },
    '#lib/11ty/index.js': {
      default: {
        build: mockBuild
      }
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  // Should throw because hasSiteOutput returns false and --build not set
  await t.throwsAsync(() => command.action({ port: 8080 }, command))

  t.false(mockBuild.called, 'build should not be called without --build flag')
})

test('serve command should throw error for invalid port', async (t) => {
  const { sandbox } = t.context

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  const error = await t.throwsAsync(() => command.action({ port: 'invalid' }, command))
  t.regex(error.message, /Invalid port/, 'should throw error for invalid port')
})

test('serve command should throw error for out of range port', async (t) => {
  const { sandbox } = t.context

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  const error = await t.throwsAsync(() => command.action({ port: 99999 }, command))
  t.regex(error.message, /Invalid port/, 'should throw error for out of range port')
})

test('serve command should register cleanup handler with processManager', async (t) => {
  const { sandbox } = t.context

  const mockOnShutdown = sandbox.stub()
  const mockOnShutdownComplete = sandbox.stub()
  const mockStop = sandbox.stub().resolves()

  // Mock serve façade
  const mockServe = sandbox.stub().resolves({
    url: 'http://localhost:8080',
    stop: mockStop
  })

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => true
    },
    '#lib/server/index.js': {
      serve: mockServe
    },
    '#lib/process/manager.js': {
      default: {
        onShutdown: mockOnShutdown,
        onShutdownComplete: mockOnShutdownComplete
      }
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  // Start the action but don't await it (it has infinite promise)
  command.action({ port: 8080, quiet: true }, command)

  // Wait a tick
  await new Promise(resolve => setImmediate(resolve))

  t.true(mockOnShutdown.called, 'should register cleanup handler')
  t.is(mockOnShutdown.firstCall.args[0], 'serve', 'should register with name "serve"')
  t.is(mockOnShutdown.firstCall.args[1], mockStop, 'should pass stop function from façade')
})

test('serve command should handle port in use error', async (t) => {
  const { sandbox } = t.context

  // Mock serve façade that rejects with port in use error
  const mockServe = sandbox.stub().rejects(new Error('Port 8080 is already in use'))

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => true
    },
    '#lib/server/index.js': {
      serve: mockServe
    },
    '#lib/process/manager.js': {
      default: {
        onShutdown: sandbox.stub(),
        onShutdownComplete: sandbox.stub()
      }
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  const error = await t.throwsAsync(() => command.action({ port: 8080, quiet: true }, command))
  t.regex(error.message, /Port 8080 is already in use/, 'should provide clear port in use message')
})

test('serve command should call open when --open flag is provided', async (t) => {
  const { sandbox } = t.context

  const mockOpen = sandbox.stub()

  // Mock serve façade
  const mockServe = sandbox.stub().resolves({
    url: 'http://localhost:8080',
    stop: sandbox.stub().resolves()
  })

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => true
    },
    '#lib/server/index.js': {
      serve: mockServe
    },
    '#lib/process/manager.js': {
      default: {
        onShutdown: sandbox.stub(),
        onShutdownComplete: sandbox.stub()
      }
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: mockOpen
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  // Start the action but don't await it (it has infinite promise)
  command.action({ port: 8080, open: true, quiet: true }, command)

  // Wait a tick for the start to complete
  await new Promise(resolve => setImmediate(resolve))

  t.true(mockOpen.called, 'open should be called when --open flag is provided')
  t.is(mockOpen.firstCall.args[0], 'http://localhost:8080', 'should open correct URL')
})

test('serve command should not call open when --open flag is not provided', async (t) => {
  const { sandbox } = t.context

  const mockOpen = sandbox.stub()

  // Mock serve façade
  const mockServe = sandbox.stub().resolves({
    url: 'http://localhost:8080',
    stop: sandbox.stub().resolves()
  })

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => true
    },
    '#lib/server/index.js': {
      serve: mockServe
    },
    '#lib/process/manager.js': {
      default: {
        onShutdown: sandbox.stub(),
        onShutdownComplete: sandbox.stub()
      }
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: mockOpen
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  // Start the action but don't await it (it has infinite promise)
  command.action({ port: 8080, quiet: true }, command)

  // Wait a tick for the start to complete
  await new Promise(resolve => setImmediate(resolve))

  t.false(mockOpen.called, 'open should not be called without --open flag')
})

test('serve command should call serve façade with correct arguments', async (t) => {
  const { sandbox } = t.context

  const mockServe = sandbox.stub().resolves({
    url: 'http://localhost:3000',
    stop: sandbox.stub().resolves()
  })

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths('/my/project'),
      hasSiteOutput: () => true
    },
    '#lib/server/index.js': {
      serve: mockServe
    },
    '#lib/process/manager.js': {
      default: {
        onShutdown: sandbox.stub(),
        onShutdownComplete: sandbox.stub()
      }
    },
    '#lib/reporter/index.js': {
      default: createMockReporter(sandbox)
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  // Start the action but don't await it
  command.action({ port: 3000, quiet: true, verbose: false }, command)

  // Wait a tick
  await new Promise(resolve => setImmediate(resolve))

  t.true(mockServe.called, 'serve façade should be called')
  t.is(mockServe.firstCall.args[0], '/my/project/_site', 'should pass getSitePath() result')
  t.deepEqual(mockServe.firstCall.args[1], { port: 3000, quiet: true, verbose: false }, 'should pass options including verbose')
})

test('serve command should configure reporter with quiet and verbose options', async (t) => {
  const { sandbox } = t.context

  const mockReporter = createMockReporter(sandbox)

  const ServeCommand = await esmock('./serve.js', {
    '#lib/project/index.js': {
      default: createMockPaths(),
      hasSiteOutput: () => false
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new ServeCommand()
  command.name = sandbox.stub().returns('serve')

  // Will throw because no build output, but reporter should still be configured
  await t.throwsAsync(() => command.action({ port: 8080, quiet: true, verbose: true }, command))

  t.true(mockReporter.configure.called, 'reporter.configure should be called')
  t.deepEqual(
    mockReporter.configure.firstCall.args[0],
    { quiet: true, verbose: true },
    'should pass quiet and verbose options to reporter'
  )
})
