import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  // Create sinon sandbox for mocking
  t.context.sandbox = sinon.createSandbox()

  // Create mock logger
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }

  // Mock config
  t.context.mockConfig = {
    get: t.context.sandbox.stub().returns('./.quire-version')
  }

  // Mock testcwd helper
  t.context.mockTestcwd = t.context.sandbox.stub()

  // Mock fs module
  t.context.mockFs = {
    readFileSync: t.context.sandbox.stub(),
    writeFileSync: t.context.sandbox.stub(),
    existsSync: t.context.sandbox.stub().returns(true)
  }

  // Default version file content
  t.context.versionFileContent = JSON.stringify({
    cli: '1.0.0-rc.33',
    starter: 'https://github.com/thegetty/quire-starter-default'
  })

  // Default package.json content
  t.context.packageJsonContent = JSON.stringify({
    name: 'test-project',
    version: '1.0.0'
  })

  // Setup default readFileSync behavior - stub returns different content based on file path
  t.context.mockFs.readFileSync.callsFake((filePath, options) => {
    if (filePath === './.quire-version') {
      return t.context.versionFileContent
    }
    if (filePath === './package.json') {
      return t.context.packageJsonContent
    }
    // For any other file, return empty string
    return ''
  })
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()
})

test('info command should validate Quire project in preAction', async (t) => {
  const { sandbox, mockLogger, mockTestcwd, mockConfig, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  // Mock Commander.js command object
  const mockCommand = {
    name: () => 'info',
    opts: () => ({})
  }

  // Call preAction
  command.preAction(mockCommand)

  t.true(mockTestcwd.called, 'testcwd should be called in preAction')
  t.true(mockTestcwd.calledWith(mockCommand), 'testcwd should be called with command')
})

test('info command should display project version information', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action({}, {})

  // Verify logger.info was called with project information
  t.true(mockLogger.info.called, 'logger.info should be called')

  // Check for project header
  const calls = mockLogger.info.getCalls()
  const hasProjectInfo = calls.some((call) =>
    call.args[0] && call.args[0].includes('Project:')
  )
  t.true(hasProjectInfo, 'should display project header')

  // Check for quire-cli version in output
  const hasCliVersion = calls.some((call) =>
    call.args[0] && call.args[0].includes('quire-cli') && call.args[0].includes('1.0.0-rc.33')
  )
  t.true(hasCliVersion, 'should display quire-cli version')

  // Check for quire-11ty version in output
  const has11tyVersion = calls.some((call) =>
    call.args[0] && call.args[0].includes('quire-11ty')
  )
  t.true(has11tyVersion, 'should display quire-11ty version')
})

test('info command should display starter version when available', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action({}, {})

  // Verify logger.info was called
  t.true(mockLogger.info.called, 'logger.info should be called')

  // Check for starter version in output (from version file)
  const calls = mockLogger.info.getCalls()
  const hasStarterVersion = calls.some((call) =>
    call.args[0] && call.args[0].includes('starter')
  )
  t.true(hasStarterVersion, 'should display starter version when available')
})

test('info command no longer has --debug flag (system info moved to doctor)', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()

  // Verify no options are defined
  t.is(InfoCommand.definition.options.length, 0, 'info command should have no options')
})

test('info command should handle missing version file', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockFs } = t.context

  // Setup mockFs to throw error for missing version file (simulating file not found)
  mockFs.readFileSync.callsFake((filePath, options) => {
    if (filePath === './.quire-version') {
      throw new Error('ENOENT: no such file')
    }
    if (filePath === './package.json') {
      return t.context.packageJsonContent
    }
    return ''
  })

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action({}, {})

  // Verify warning was logged about old version
  t.true(mockLogger.warn.called, 'logger.warn should be called for missing version file')
  t.true(
    mockLogger.warn.calledWith(sinon.match(/prior to version 1.0.0.rc-8/)),
    'should warn about old project version'
  )

  // Verify version file was created
  t.true(mockFs.writeFileSync.called, 'writeFileSync should be called to create version file')
})

test('info command should handle malformed version file', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockFs } = t.context

  // Setup mockFs to return malformed JSON (simulating corrupted file)
  mockFs.readFileSync.callsFake((filePath, options) => {
    if (filePath === './.quire-version') {
      return 'invalid json{'
    }
    if (filePath === './package.json') {
      return t.context.packageJsonContent
    }
    return ''
  })

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action({}, {})

  // Verify warning was logged
  t.true(mockLogger.warn.called, 'logger.warn should be called for malformed version file')

  // Verify version file was overwritten with valid JSON
  t.true(mockFs.writeFileSync.called, 'writeFileSync should be called to fix malformed version file')

  // Check that the content written is valid JSON
  const writeCall = mockFs.writeFileSync.getCall(0)
  if (writeCall) {
    const writtenContent = writeCall.args[1]
    t.notThrows(() => JSON.parse(writtenContent), 'written content should be valid JSON')
  }
})

test('info command should read quire-11ty version from package.json', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockFs } = t.context

  // Override package.json to have specific version
  mockFs.readFileSync.callsFake((filePath, options) => {
    if (filePath === './.quire-version') {
      return t.context.versionFileContent
    }
    if (filePath === './package.json') {
      return JSON.stringify({
        name: 'test-project',
        version: '2.5.3'
      })
    }
    return ''
  })

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = sandbox.stub()

  await command.action({}, {})

  // Verify logger.info was called
  t.true(mockLogger.info.called, 'logger.info should be called')

  // Check for quire-11ty version from package.json
  const calls = mockLogger.info.getCalls()
  const hasEleventyVersion = calls.some((call) =>
    call.args[0] && call.args[0].includes('quire-11ty') && call.args[0].includes('2.5.3')
  )
  t.true(hasEleventyVersion, 'should display quire-11ty version from package.json')
})

test('info command should log debug information', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockFs } = t.context

  const mockDebug = sandbox.stub()

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'node:fs': mockFs
  }, {
    '#lib/logger/index.js': {
      default: () => mockLogger
    }
  })

  const command = new InfoCommand()
  command.config = mockConfig
  command.logger = mockLogger
  command.debug = mockDebug

  await command.action({}, {})

  // Verify debug was called
  t.true(mockDebug.called, 'debug should be called')
  t.true(mockDebug.calledWith('called with options %O', {}))
})
