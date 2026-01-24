import esmock from 'esmock'
import path from 'node:path'
import sinon from 'sinon'
import test from 'ava'

/**
 * Installer Module Integration Tests
 *
 * Tests the installer façade module behavior with mocked dependencies.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// getVersionFromPath() tests
// ─────────────────────────────────────────────────────────────────────────────

test('getVersionFromPath() throws InvalidPathError when path does not exist', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(false),
    readJsonSync: sandbox.stub()
  }

  const { getVersionFromPath } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const error = t.throws(() => getVersionFromPath('/nonexistent/path'))

  t.is(error.code, 'INVALID_PATH', 'should throw InvalidPathError')
  t.true(error.message.includes('/nonexistent/path'))
})

test('getVersionFromPath() throws VersionNotFoundError when package.json is missing', async (t) => {
  const { sandbox } = t.context

  const resolvedQuirePath = path.resolve('/local/quire')
  const packageJsonPath = path.join(resolvedQuirePath, 'package.json')

  const existsSyncStub = sandbox.stub()
  existsSyncStub.withArgs(resolvedQuirePath).returns(true)
  existsSyncStub.withArgs(packageJsonPath).returns(false)

  const mockFs = {
    existsSync: existsSyncStub,
    readJsonSync: sandbox.stub()
  }

  const { getVersionFromPath } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const error = t.throws(() => getVersionFromPath('/local/quire'))

  t.is(error.code, 'VERSION_NOT_FOUND', 'should throw VersionNotFoundError')
  t.true(error.message.includes('package.json not found'))
})

test('getVersionFromPath() throws VersionNotFoundError when package.json has no version', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    readJsonSync: sandbox.stub().returns({ name: '@thegetty/quire-11ty' }) // no version
  }

  const { getVersionFromPath } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const error = t.throws(() => getVersionFromPath('/local/quire'))

  t.is(error.code, 'VERSION_NOT_FOUND', 'should throw VersionNotFoundError')
  t.true(error.message.includes('no version field'))
})

test('getVersionFromPath() returns version and resolved path when valid', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    readJsonSync: sandbox.stub().returns({ version: '1.0.0-local' })
  }

  const { getVersionFromPath } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const result = getVersionFromPath('/local/quire')

  t.is(result.version, '1.0.0-local')
  t.truthy(result.resolvedPath)
})

// ─────────────────────────────────────────────────────────────────────────────
// latest() tests
// ─────────────────────────────────────────────────────────────────────────────

test('latest() returns latest version when called with "latest"', async (t) => {
  const { sandbox } = t.context

  const mockNpm = {
    view: sandbox.stub().resolves('1.0.5'),
    getCompatibleVersion: sandbox.stub()
  }

  const { latest } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: mockNpm },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': {},
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const result = await latest('latest')

  t.is(result, '1.0.5')
  t.true(mockNpm.view.calledWith('@thegetty/quire-11ty', 'version'))
})

test('latest() returns latest version when called without argument', async (t) => {
  const { sandbox } = t.context

  const mockNpm = {
    view: sandbox.stub().resolves('1.0.5'),
    getCompatibleVersion: sandbox.stub()
  }

  const { latest } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: mockNpm },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': {},
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const result = await latest()

  t.is(result, '1.0.5')
  t.true(mockNpm.view.calledWith('@thegetty/quire-11ty', 'version'))
})

test('latest() resolves semver range to compatible version', async (t) => {
  const { sandbox } = t.context

  const mockNpm = {
    view: sandbox.stub(),
    getCompatibleVersion: sandbox.stub().resolves('1.2.3')
  }

  const { latest } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: mockNpm },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': {},
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const result = await latest('^1.0.0')

  t.is(result, '1.2.3')
  t.true(mockNpm.getCompatibleVersion.calledWith('@thegetty/quire-11ty', '^1.0.0'))
  t.false(mockNpm.view.called)
})

test('latest() throws error when no compatible version found', async (t) => {
  const { sandbox } = t.context

  const mockNpm = {
    view: sandbox.stub(),
    getCompatibleVersion: sandbox.stub().resolves(null)
  }

  const { latest } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: mockNpm },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': {},
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const error = await t.throwsAsync(() => latest('^99.0.0'))

  t.is(error.code, 'VERSION_NOT_FOUND')
  t.true(error.message.includes('^99.0.0'))
})

// ─────────────────────────────────────────────────────────────────────────────
// versions() tests
// ─────────────────────────────────────────────────────────────────────────────

test('versions() returns all published versions', async (t) => {
  const { sandbox } = t.context

  const mockNpm = {
    show: sandbox.stub().resolves(['1.0.0', '1.0.1', '1.1.0'])
  }

  const { versions } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: mockNpm },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { default: {} },
    'fs-extra': {},
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const result = await versions()

  t.deepEqual(result, ['1.0.0', '1.0.1', '1.1.0'])
  t.true(mockNpm.show.calledWith('@thegetty/quire-11ty', 'versions'))
})

// ─────────────────────────────────────────────────────────────────────────────
// initStarter() tests
// ─────────────────────────────────────────────────────────────────────────────

test('initStarter() throws when target directory is not empty', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    ensureDirSync: sandbox.stub(),
    remove: sandbox.stub()
  }

  // Create a mock Git class
  class MockGit {
    constructor() {}
    clone() { return Promise.resolve() }
    init() { return Promise.resolve() }
    add() { return Promise.resolve() }
    commit() { return Promise.resolve() }
  }

  const { initStarter } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { Git: MockGit },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub().returns(false) },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  await t.throwsAsync(
    () => initStarter('https://github.com/test/starter', '/project'),
    { message: /non-empty directory/ }
  )
})

test('initStarter() clones starter and sets up project', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    ensureDirSync: sandbox.stub(),
    remove: sandbox.stub().resolves(),
    readFileSync: sandbox.stub().returns(JSON.stringify({
      version: '1.0.0',
      peerDependencies: { '@thegetty/quire-11ty': '^1.0.0' }
    })),
    writeFileSync: sandbox.stub()
  }

  // Create a mock Git class with spies
  const gitSpies = {
    clone: sandbox.stub().resolves(),
    init: sandbox.stub().resolves(),
    add: sandbox.stub().resolves(),
    commit: sandbox.stub().resolves()
  }

  class MockGit {
    constructor() {}
    clone(...args) { return gitSpies.clone(...args) }
    init(...args) { return gitSpies.init(...args) }
    add(...args) { return gitSpies.add(...args) }
    commit(...args) { return gitSpies.commit(...args) }
  }

  const mockNpm = {
    init: sandbox.stub().resolves(),
    getCompatibleVersion: sandbox.stub().resolves('1.2.0')
  }

  const { initStarter } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: mockNpm },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub().resolves({
        quire11tyVersion: '^1.0.0',
        starterVersion: '1.0.0'
      }),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { Git: MockGit },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub().returns(true) },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const result = await initStarter('https://github.com/test/starter', '/project')

  t.is(result, '1.2.0', 'should return resolved quire version')
  t.true(gitSpies.clone.called, 'should clone starter repository')
  t.true(gitSpies.init.called, 'should initialize git repository')
  t.true(mockNpm.init.called, 'should run npm init')
})

// ─────────────────────────────────────────────────────────────────────────────
// installer object export tests
// ─────────────────────────────────────────────────────────────────────────────

test('installer object exports all required functions', async (t) => {
  const { sandbox } = t.context

  // Create a mock Git class
  class MockGit {
    constructor() {}
    clone() { return Promise.resolve() }
    init() { return Promise.resolve() }
    add() { return Promise.resolve() }
    commit() { return Promise.resolve() }
    rm() { return Promise.resolve() }
  }

  const { installer } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { Git: MockGit },
    'fs-extra': {},
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  t.is(typeof installer.initStarter, 'function', 'should export initStarter')
  t.is(typeof installer.installInProject, 'function', 'should export installInProject')
  t.is(typeof installer.latest, 'function', 'should export latest')
  t.is(typeof installer.versions, 'function', 'should export versions')
})

// ─────────────────────────────────────────────────────────────────────────────
// installInProject() quirePath validation tests
// ─────────────────────────────────────────────────────────────────────────────

test('installInProject() throws InvalidPathError when quirePath does not exist', async (t) => {
  const { sandbox } = t.context

  // Create a mock Git class
  class MockGit {
    constructor() {}
    rm() { return Promise.resolve() }
    add() { return Promise.resolve() }
    commit() { return Promise.resolve() }
  }

  const mockFs = {
    mkdirSync: sandbox.stub(),
    existsSync: sandbox.stub().returns(false)
  }

  const { installInProject } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { Git: MockGit },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const error = await t.throwsAsync(
    () => installInProject('/project', '1.0.0', { quirePath: '/nonexistent/path' })
  )

  t.is(error.code, 'INVALID_PATH', 'should throw InvalidPathError')
  t.true(error.message.includes('--quire-path does not exist'))
  t.true(error.message.includes('/nonexistent/path'))
})

test('installInProject() throws InvalidPathError with resolved path for relative quirePath', async (t) => {
  const { sandbox } = t.context

  // Create a mock Git class
  class MockGit {
    constructor() {}
    rm() { return Promise.resolve() }
    add() { return Promise.resolve() }
    commit() { return Promise.resolve() }
  }

  const mockFs = {
    mkdirSync: sandbox.stub(),
    existsSync: sandbox.stub().returns(false)
  }

  const { installInProject } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: {} },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { Git: MockGit },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  const error = await t.throwsAsync(
    () => installInProject('/project', '1.0.0', { quirePath: '../relative/path' })
  )

  t.is(error.code, 'INVALID_PATH', 'should throw InvalidPathError')
  t.true(error.message.includes('--quire-path does not exist'))
  t.true(error.message.includes('../relative/path'))
  t.true(error.message.includes('resolved to:'), 'should show resolved path for relative paths')
})

test('installInProject() copies from quirePath when it exists', async (t) => {
  const { sandbox } = t.context

  // Create a mock Git class
  class MockGit {
    constructor() {}
    rm() { return Promise.resolve() }
    add() { return Promise.resolve() }
    commit() { return Promise.resolve() }
  }

  const cpSyncStub = sandbox.stub()
  const rmSyncStub = sandbox.stub()

  const mockFs = {
    mkdirSync: sandbox.stub(),
    existsSync: sandbox.stub().returns(true),
    readJsonSync: sandbox.stub().returns({ version: '1.0.0-local' }),
    cpSync: cpSyncStub,
    rmSync: rmSyncStub
  }

  const mockNpm = {
    install: sandbox.stub().resolves()
  }

  const { installInProject } = await esmock('./index.js', {
    '#lib/npm/index.js': { default: mockNpm },
    '#lib/project/index.js': {
      getVersionsFromStarter: sandbox.stub(),
      setVersion: sandbox.stub(),
      writeVersionFile: sandbox.stub()
    },
    '#lib/git/index.js': { Git: MockGit },
    'fs-extra': mockFs,
    '#helpers/is-empty.js': { isEmpty: sandbox.stub() },
    '#src/packageConfig.js': { default: { version: '1.0.0' } }
  })

  await installInProject('/project', '1.0.0', { quirePath: '/local/quire-11ty' })

  // Should copy from local path, not download
  t.true(cpSyncStub.called, 'should copy from local path')
  const [srcPath] = cpSyncStub.firstCall.args
  t.is(srcPath, path.resolve('/local/quire-11ty'), 'should use resolved quirePath as source')
})

// Nota bene: Version reading from local package.json is now done in initStarter
// via getVersionFromPath, not in installInProject. See getVersionFromPath tests above.
