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

  // Mock execa for external commands
  t.context.mockExeca = t.context.sandbox.stub().resolves({ stdout: '1.0.0-rc.33' })

  // Mock npm module
  t.context.mockNpm = {
    version: t.context.sandbox.stub().resolves('10.2.4')
  }

  // Mock os module
  t.context.mockOs = {
    type: t.context.sandbox.stub().returns('Darwin'),
    release: t.context.sandbox.stub().returns('23.0.0')
  }

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
  const { sandbox, mockLogger, mockTestcwd, mockConfig, mockExeca, mockNpm, mockOs, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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

  // Check for project section header (uses current directory name)
  const calls = mockLogger.info.getCalls()
  const hasProjectInfo = calls.some((call) =>
    call.args[0] && call.args[0].includes('[') && call.args[0].includes(']')
  )
  t.true(hasProjectInfo, 'should display project section')

  // Check for quire-cli version in output
  const hasCliVersion = calls.some((call) =>
    call.args[0] && call.args[0].includes('quire-cli') && call.args[0].includes('1.0.0-rc.33')
  )
  t.true(hasCliVersion, 'should display quire-cli version')
})

test('info command should display system information with debug flag', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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

  await command.action({ debug: true }, {})

  // Verify logger.info was called
  t.true(mockLogger.info.called, 'logger.info should be called')

  // Check for system section header
  const calls = mockLogger.info.getCalls()
  const hasSystemInfo = calls.some((call) =>
    call.args[0] && call.args[0].includes('[System]')
  )
  t.true(hasSystemInfo, 'should display system section with debug flag')

  // Check for node version in output (only shown with debug)
  const hasNodeVersion = calls.some((call) =>
    call.args[0] && call.args[0].includes('node')
  )
  t.true(hasNodeVersion, 'should display node version with debug flag')

  // Check for npm version in output (only shown with debug)
  const hasNpmVersion = calls.some((call) =>
    call.args[0] && call.args[0].includes('npm')
  )
  t.true(hasNpmVersion, 'should display npm version with debug flag')
})

test('info command should hide system details without debug flag', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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

  // Check that system details are NOT shown without debug flag
  const calls = mockLogger.info.getCalls()

  // Node version should not appear in non-debug output
  const hasNodeVersion = calls.some((call) =>
    call.args[0] && call.args[0].toLowerCase().includes('node') && !call.args[0].includes('quire')
  )
  t.false(hasNodeVersion, 'should not display node version without debug flag')
})

test('info command should handle missing version file', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context

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
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context

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
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context

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
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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

test('info command should log debug information when debug flag is set', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context

  const mockDebug = sandbox.stub()

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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

  await command.action({ debug: true }, {})

  // Verify debug was called
  t.true(mockDebug.called, 'debug should be called with debug flag')
  t.true(mockDebug.calledWith('called with options %O', { debug: true }))
})

// ─────────────────────────────────────────────────────────────────────────────
// JSON output tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('info --json should output valid JSON with project and system versions', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context
  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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

  await command.action({ json: true }, {})

  // Should output via console.log, not logger.info
  t.true(consoleLogStub.calledOnce, 'console.log should be called once')
  t.false(mockLogger.info.called, 'logger.info should not be called in JSON mode')

  // Parse and validate the JSON structure
  const output = JSON.parse(consoleLogStub.firstCall.args[0])

  t.truthy(output.project, 'JSON should have project section')
  t.truthy(output.system, 'JSON should have system section')

  // Project section
  t.is(output.project.cli, '1.0.0-rc.33')
  t.is(output.project.quire11ty, '1.0.0')
  t.is(output.project.starter, 'https://github.com/thegetty/quire-starter-default')
  t.is(typeof output.project.directory, 'string')

  // System section (always included regardless of --debug)
  t.is(output.system.cli, '1.0.0-rc.33')
  t.is(output.system.npm, '10.2.4')
  t.is(output.system.os, 'Darwin 23.0.0')
  t.is(typeof output.system.node, 'string')
})

test.serial('info --json should include system details without --debug flag', async (t) => {
  const { sandbox, mockLogger, mockConfig, mockTestcwd, mockExeca, mockNpm, mockOs, mockFs } = t.context
  const consoleLogStub = sandbox.stub(console, 'log')

  const { default: InfoCommand } = await esmock('./info.js', {
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'execa': {
      execa: mockExeca
    },
    '#lib/npm/index.js': {
      default: mockNpm
    },
    'node:os': mockOs,
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

  // JSON mode without --debug should still include system node/npm/os
  await command.action({ json: true }, {})

  const output = JSON.parse(consoleLogStub.firstCall.args[0])

  t.truthy(output.system.node, 'JSON should include node version without --debug')
  t.truthy(output.system.npm, 'JSON should include npm version without --debug')
  t.truthy(output.system.os, 'JSON should include os version without --debug')
})
