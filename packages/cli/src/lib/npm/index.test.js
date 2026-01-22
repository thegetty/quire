import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * NPM Façade Integration Tests
 *
 * Tests the npm façade module behavior with mocked dependencies.
 * Uses esmock to replace execa and node-fetch calls.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('version() calls npm --version and returns stdout', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stdout: '10.2.4' })
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  const result = await npm.version()

  t.is(result, '10.2.4')
  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('npm', ['--version']))
})

test('init() calls npm init with --yes flag by default', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.init('/path/to/project')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('npm', ['init', '--yes'], { cwd: '/path/to/project' }))
})

test('init() omits --yes flag when yes option is false', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.init('/path/to/project', { yes: false })

  t.true(mockExeca.calledWith('npm', ['init'], { cwd: '/path/to/project' }))
})

test('install() calls npm install with correct flags', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.install('/path/to/project', { saveDev: true, preferOffline: true })

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('npm', ['install', '--prefer-offline', '--save-dev'], { cwd: '/path/to/project' }))
})

test('install() calls npm install without flags when no options provided', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.install('/path/to/project')

  t.true(mockExeca.calledWith('npm', ['install'], { cwd: '/path/to/project' }))
})

test('pack() calls npm pack with package spec and destination', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.pack('@thegetty/quire-11ty@1.0.0', '/tmp/dest', { quiet: true })

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('npm', ['pack', '--quiet', '--pack-destination', '/tmp/dest', '@thegetty/quire-11ty@1.0.0']))
})

test('pack() uses --debug flag when debug option is true', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.pack('@thegetty/quire-11ty@1.0.0', '/tmp/dest', { debug: true, quiet: false })

  t.true(mockExeca.calledWith('npm', ['pack', '--debug', '--pack-destination', '/tmp/dest', '@thegetty/quire-11ty@1.0.0']))
})

test('cacheClean() calls npm cache clean --force', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.cacheClean('/path/to/project')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('npm', ['cache', 'clean', '--force'], { cwd: '/path/to/project' }))
})

test('view() calls npm view with package name and field', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stdout: '1.0.0' })
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  const result = await npm.view('@thegetty/quire-11ty', 'version')

  t.is(result, '1.0.0')
  t.true(mockExeca.calledWith('npm', ['view', '@thegetty/quire-11ty', 'version']))
})

test('show() calls npm show with package name and field', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stdout: "['1.0.0', '1.0.1']" })
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich }
  })

  await npm.show('@thegetty/quire-11ty', 'versions')

  t.true(mockExeca.calledWith('npm', ['show', '@thegetty/quire-11ty', 'versions']))
})

test('fetchFromRegistry() fetches package metadata from npm registry', async (t) => {
  const { sandbox } = t.context

  const mockResponse = {
    ok: true,
    json: sandbox.stub().resolves({
      name: '@thegetty/quire-11ty',
      versions: { '1.0.0': {}, '1.0.1': {} }
    })
  }
  const mockFetch = sandbox.stub().resolves(mockResponse)
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    'node-fetch': { default: mockFetch },
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich }
  })

  const result = await npm.fetchFromRegistry('@thegetty/quire-11ty')

  t.deepEqual(result, { name: '@thegetty/quire-11ty', versions: { '1.0.0': {}, '1.0.1': {} } })
  t.true(mockFetch.calledWith('https://registry.npmjs.org/@thegetty/quire-11ty'))
})

test('fetchFromRegistry() throws error when response is not ok', async (t) => {
  const { sandbox } = t.context

  const mockResponse = {
    ok: false,
    statusText: 'Not Found'
  }
  const mockFetch = sandbox.stub().resolves(mockResponse)
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    'node-fetch': { default: mockFetch },
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich }
  })

  await t.throwsAsync(
    () => npm.fetchFromRegistry('nonexistent-package'),
    { message: /Failed to fetch package metadata/ }
  )
})

test('getCompatibleVersion() returns latest version matching semver range', async (t) => {
  const { sandbox } = t.context

  const mockResponse = {
    ok: true,
    json: sandbox.stub().resolves({
      versions: {
        '1.0.0': {},
        '1.0.1': {},
        '1.1.0': {},
        '2.0.0': {}
      }
    })
  }
  const mockFetch = sandbox.stub().resolves(mockResponse)
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    'node-fetch': { default: mockFetch },
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich }
  })

  const result = await npm.getCompatibleVersion('@thegetty/quire-11ty', '^1.0.0')

  t.is(result, '1.1.0')
})

test('getCompatibleVersion() returns null when no compatible version found', async (t) => {
  const { sandbox } = t.context

  const mockResponse = {
    ok: true,
    json: sandbox.stub().resolves({
      versions: {
        '2.0.0': {},
        '3.0.0': {}
      }
    })
  }
  const mockFetch = sandbox.stub().resolves(mockResponse)
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    'node-fetch': { default: mockFetch },
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich }
  })

  const result = await npm.getCompatibleVersion('@thegetty/quire-11ty', '^1.0.0')

  t.is(result, null)
})

test('isAvailable() returns true when npm is found in PATH', async (t) => {
  const { sandbox } = t.context

  const mockWhich = sandbox.stub().returns('/usr/bin/npm')

  const npm = await esmock('./index.js', {
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich }
  })

  const result = npm.isAvailable()

  t.true(result)
  t.true(mockWhich.calledWith('npm'))
})

test('isAvailable() returns false when npm is not found in PATH', async (t) => {
  const { sandbox } = t.context

  const mockWhich = sandbox.stub().returns(null)

  const npm = await esmock('./index.js', {
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich }
  })

  const result = npm.isAvailable()

  t.false(result)
})

test('install() logs stderr via debug when present', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stderr: 'npm WARN deprecated' })
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')
  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
    '#debug': { default: mockCreateDebug }
  })

  await npm.install('/path/to/project')

  t.true(mockDebug.calledWith('npm install stderr: %s', 'npm WARN deprecated'))
})

test('cacheClean() logs stderr via debug when present', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stderr: 'cache warning' })
  const mockWhich = sandbox.stub().returns('/usr/bin/npm')
  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const npm = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
    '#debug': { default: mockCreateDebug }
  })

  await npm.cacheClean('/path/to/project')

  t.true(mockDebug.calledWith('npm cache clean stderr: %s', 'cache warning'))
})
