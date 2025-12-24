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
    '/starter-template/content/_data/config.yaml': 'title: Starter Template',
    '/starter-template/package.json': JSON.stringify({ name: 'starter-template' })
  })

  t.context.projectRoot = '/new-project'

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

test('create command should initialize starter and install quire', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock quire library
  const mockQuire = {
    initStarter: sandbox.stub().callsFake(async (starter, projectPath) => {
      // Simulate creating project directory
      fs.mkdirSync(projectPath, { recursive: true })
      fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify({ name: 'new-project' }))
      return '1.0.0'
    }),
    installInProject: sandbox.stub().resolves()
  }

  // Mock config
  const mockConfig = {
    get: sandbox.stub().returns('default-starter')
  }

  // Use esmock to replace imports
  const CreateCommand = await esmock('./create.js', {
    '#src/lib/quire/index.js': {
      quire: mockQuire
    },
    '#src/lib/logger.js': {
      default: mockLogger
    },
    'fs-extra': fs
  })

  const command = new CreateCommand()
  command.config = mockConfig
  command.name = sandbox.stub().returns('new')

  // Run action
  await command.action('/new-project', 'starter-template', {})

  t.true(mockQuire.initStarter.called, 'initStarter should be called')
  t.true(mockQuire.initStarter.calledWith('starter-template', '/new-project'), 'initStarter should be called with correct arguments')
  t.true(mockQuire.installInProject.called, 'installInProject should be called')
  t.true(mockQuire.installInProject.calledWith('/new-project', '1.0.0'), 'installInProject should be called with project path and version')
})

test('create command should use default starter from config when not provided', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock quire library
  const mockQuire = {
    initStarter: sandbox.stub().callsFake(async (starter, projectPath) => {
      fs.mkdirSync(projectPath, { recursive: true })
      fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify({ name: 'new-project' }))
      return '1.0.0'
    }),
    installInProject: sandbox.stub().resolves()
  }

  // Mock config
  const mockConfig = {
    get: sandbox.stub().returns('https://github.com/thegetty/quire-starter-default')
  }

  // Use esmock to replace imports
  const CreateCommand = await esmock('./create.js', {
    '#src/lib/quire/index.js': {
      quire: mockQuire
    },
    '#src/lib/logger.js': {
      default: mockLogger
    },
    'fs-extra': fs
  })

  const command = new CreateCommand()
  command.config = mockConfig
  command.name = sandbox.stub().returns('new')

  // Run action without starter argument
  await command.action('/new-project', null, {})

  t.true(mockConfig.get.calledWith('projectTemplate'), 'config.get should be called for projectTemplate')
  t.true(mockQuire.initStarter.calledWith('https://github.com/thegetty/quire-starter-default', '/new-project'), 'initStarter should use default starter from config')
})

test('create command should pass quire-version option to installInProject', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock quire library
  const mockQuire = {
    initStarter: sandbox.stub().callsFake(async (starter, projectPath) => {
      fs.mkdirSync(projectPath, { recursive: true })
      fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify({ name: 'new-project' }))
      return '1.0.0-rc.10'
    }),
    installInProject: sandbox.stub().resolves()
  }

  // Mock config
  const mockConfig = {
    get: sandbox.stub().returns('default-starter')
  }

  // Use esmock to replace imports
  const CreateCommand = await esmock('./create.js', {
    '#src/lib/quire/index.js': {
      quire: mockQuire
    },
    '#src/lib/logger.js': {
      default: mockLogger
    },
    'fs-extra': fs
  })

  const command = new CreateCommand()
  command.config = mockConfig
  command.name = sandbox.stub().returns('new')

  const options = { quireVersion: '1.0.0-rc.10' }

  // Run action with quire-version option
  await command.action('/new-project', 'starter-template', options)

  t.true(mockQuire.installInProject.called, 'installInProject should be called')
  const installCall = mockQuire.installInProject.getCall(0)
  t.true(installCall.args[2] === options, 'installInProject should receive options object')
})

test('create command should handle initStarter errors gracefully', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  const error = new Error('Failed to initialize starter template')

  // Mock quire library
  const mockQuire = {
    initStarter: sandbox.stub().rejects(error),
    installInProject: sandbox.stub().resolves()
  }

  // Mock config
  const mockConfig = {
    get: sandbox.stub().returns('default-starter')
  }

  // Add removeSync to fs if it doesn't exist (memfs compatibility)
  if (!fs.removeSync) {
    fs.removeSync = sandbox.stub().callsFake((path) => {
      if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true, force: true })
      }
    })
  }

  // Use esmock to replace imports
  const CreateCommand = await esmock('./create.js', {
    '#src/lib/quire/index.js': {
      quire: mockQuire
    },
    '#src/lib/logger.js': {
      default: mockLogger
    },
    'fs-extra': fs
  })

  const command = new CreateCommand()
  command.config = mockConfig
  command.name = sandbox.stub().returns('new')

  // Run action - should handle error without throwing
  await command.action('/new-project', 'starter-template', {})

  t.true(mockQuire.initStarter.called, 'initStarter should be called')
  t.false(mockQuire.installInProject.called, 'installInProject should not be called when initStarter fails')
  t.true(fs.removeSync.called || !fs.existsSync('/new-project'), 'project directory should be removed on error')
  t.true(mockLogger.error.calledWith(error.message), 'error message should be logged')
})

test('create command should pass through debug option', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock quire library
  const mockQuire = {
    initStarter: sandbox.stub().callsFake(async (starter, projectPath) => {
      fs.mkdirSync(projectPath, { recursive: true })
      fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify({ name: 'new-project' }))
      return '1.0.0'
    }),
    installInProject: sandbox.stub().resolves()
  }

  // Mock config
  const mockConfig = {
    get: sandbox.stub().returns('default-starter')
  }

  // Use esmock to replace imports
  const CreateCommand = await esmock('./create.js', {
    '#src/lib/quire/index.js': { quire: mockQuire },
    '#src/lib/logger.js': { default: mockLogger },
    'fs-extra': fs
  })

  const command = new CreateCommand()
  command.config = mockConfig
  command.name = sandbox.stub().returns('new')

  // Run action with debug option
  await command.action('/new-project', 'starter-template', { debug: true })

  t.true(mockLogger.info.called, 'logger.info should be called with debug option')
  t.true(mockQuire.initStarter.called, 'initStarter should be called')
})

test('create command should pass quire-path option to methods', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock quire library
  const mockQuire = {
    initStarter: sandbox.stub().callsFake(async (starter, projectPath) => {
      fs.mkdirSync(projectPath, { recursive: true })
      fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify({ name: 'new-project' }))
      return '1.0.0'
    }),
    installInProject: sandbox.stub().resolves()
  }

  // Mock config
  const mockConfig = {
    get: sandbox.stub().returns('default-starter')
  }

  // Use esmock to replace imports
  const CreateCommand = await esmock('./create.js', {
    '#src/lib/quire/index.js': {
      quire: mockQuire
    },
    '#src/lib/logger.js': {
      default: mockLogger
    },
    'fs-extra': fs
  })

  const command = new CreateCommand()
  command.config = mockConfig
  command.name = sandbox.stub().returns('new')

  const options = { quirePath: '/custom/path/to/quire-11ty' }

  // Run action with quire-path option
  await command.action('/new-project', 'starter-template', options)

  const initCall = mockQuire.initStarter.getCall(0)
  const installCall = mockQuire.installInProject.getCall(0)

  t.true(initCall.args[2] === options, 'initStarter should receive options with quire-path')
  t.true(installCall.args[2] === options, 'installInProject should receive options with quire-path')
})
