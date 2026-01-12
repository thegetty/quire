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

  // Setup mock Quire project directory structure
  t.context.vol.fromJSON({
    '/project/.quire': '',
    '/project/content/_data/config.yaml': 'title: Test Project',
    '/project/package.json': JSON.stringify({ name: 'test-project' })
  })

  t.context.projectRoot = '/project'

  // Create mock logger
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }

  // Mock testcwd helper (returns true for Quire projects)
  t.context.mockTestcwd = t.context.sandbox.stub()
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('version command should validate Quire project in preAction', async (t) => {
  const { mockLogger, mockTestcwd } = t.context

  const VersionCommand = await esmock('./version.js', {
    '#src/lib/logger.js': {
      default: mockLogger
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    }
  })

  const command = new VersionCommand()

  // Mock Commander.js command object
  const mockCommand = {
    name: () => 'version',
    opts: () => ({})
  }

  // Call preAction
  command.preAction(mockCommand)

  t.true(mockTestcwd.called, 'testcwd should be called in preAction')
  t.true(mockTestcwd.calledWith(mockCommand), 'testcwd should be called with command')
})

test('version command should accept version argument', async (t) => {
  const { mockLogger, mockTestcwd } = t.context

  const VersionCommand = await esmock('./version.js', {
    '#src/lib/logger.js': {
      default: mockLogger
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    }
  })

  const command = new VersionCommand()

  // Call action with version argument
  await command.action('1.0.0-rc.33', {})

  // Currently the command just validates, doesn't throw
  t.pass('command should accept valid version argument')
})

test('version command should log debug information when debug flag is set', async (t) => {
  const { mockLogger, mockTestcwd } = t.context

  const VersionCommand = await esmock('./version.js', {
    '#src/lib/logger.js': {
      default: mockLogger
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    }
  })

  const command = new VersionCommand()

  // Call action with debug flag
  await command.action('1.0.0-rc.33', { debug: true })

  t.true(mockLogger.info.called, 'logger.info should be called with debug flag')

  // Verify the logger was called with the correct format
  const call = mockLogger.info.getCall(0)
  t.truthy(call, 'logger.info should have been called')
  t.true(call.args[0].includes('Command'), 'first arg should contain "Command"')
  t.is(call.args[1], 'version', 'second arg should be command name')
  t.deepEqual(call.args[2], { debug: true }, 'third arg should be options')
})

test('version command should handle semver version strings', async (t) => {
  const { mockLogger, mockTestcwd } = t.context

  const VersionCommand = await esmock('./version.js', {
    '#src/lib/logger.js': {
      default: mockLogger
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    }
  })

  const command = new VersionCommand()

  // Test various semver formats
  const validVersions = [
    '1.0.0',
    '1.0.0-rc.1',
    '1.0.0-beta.2',
    '2.1.3',
    '0.0.1'
  ]

  for (const version of validVersions) {
    await command.action(version, {})
    t.pass(`should accept valid semver: ${version}`)
  }
})

test('version command should work with options object', async (t) => {
  const { mockLogger, mockTestcwd } = t.context

  const VersionCommand = await esmock('./version.js', {
    '#src/lib/logger.js': {
      default: mockLogger
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    }
  })

  const command = new VersionCommand()

  // Test with various options
  await command.action('1.0.0', { debug: false })
  await command.action('1.0.0', { debug: true })
  await command.action('1.0.0', {})

  t.pass('command should handle various option combinations')
})

test('version command preAction should be called before action', async (t) => {
  const { mockLogger, mockTestcwd } = t.context

  const VersionCommand = await esmock('./version.js', {
    '#src/lib/logger.js': {
      default: mockLogger
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    }
  })

  const command = new VersionCommand()

  // Mock Commander.js command object
  const mockCommand = {
    name: () => 'version',
    opts: () => ({})
  }

  // Verify preAction exists and can be called
  t.is(typeof command.preAction, 'function', 'preAction should be a function')

  // Call preAction (would be called by Commander.js before action)
  command.preAction(mockCommand)

  // Verify testcwd was called
  t.true(mockTestcwd.called, 'testcwd should validate project directory')
})

test('version command should have correct command definition', async (t) => {
  const { mockLogger, mockTestcwd } = t.context

  const VersionCommand = await esmock('./version.js', {
    '#src/lib/logger.js': {
      default: mockLogger
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    }
  })

  const command = new VersionCommand()

  t.is(command.name, 'version', 'command name should be "version"')
  t.truthy(command.description, 'command should have description')
  t.truthy(command.summary, 'command should have summary')
  t.truthy(command.version, 'command should have version')
  t.true(Array.isArray(command.args), 'command should have args array')
  t.is(command.args.length, 1, 'command should have 1 argument')
})
