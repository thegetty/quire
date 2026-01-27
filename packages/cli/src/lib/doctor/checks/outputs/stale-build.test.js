import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'
import path from 'node:path'

const TWO_MINUTES = 120000
const TEN_MINUTES = 600000
const ONE_HOUR = 3600000
const TWO_HOURS = 7200000

const configMock = { default: { get: () => 'HOURLY' } }
const buildStatusMock = { getStatus: () => undefined }

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkStaleBuild returns N/A when no _site directory exists', async (t) => {
  const { sandbox } = t.context

  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/conf/config.js': configMock,
    '#lib/conf/build-status.js': buildStatusMock,
  })

  const result = checkStaleBuild()

  t.true(result.ok)
  t.is(result.level, 'na', 'should return N/A level when no build output')
  t.regex(result.message, /No build output found/)
  t.truthy(result.remediation)
  t.regex(result.remediation, /quire build/)
  t.regex(result.remediation, /failed/)
  t.truthy(result.docsUrl)
})

test('checkStaleBuild returns warning when last build failed and no _site exists', async (t) => {
  const { sandbox } = t.context

  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/conf/config.js': configMock,
    '#lib/conf/build-status.js': {
      getStatus: () => ({ status: 'failed', timestamp: Date.now() }),
    },
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /Last build failed/)
  t.truthy(result.remediation)
  t.regex(result.remediation, /quire build --debug/)
  t.truthy(result.docsUrl)
})

test('checkStaleBuild returns ok when build is up to date', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const existsSync = sandbox.stub()
  existsSync.withArgs('_site').returns(true)
  existsSync.returns(false) // source directories don't exist

  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync,
      statSync: sandbox.stub().returns({ mtimeMs: now }),
      readdirSync: sandbox.stub().returns([]),
    },
    '#lib/project/index.js': {
      SOURCE_DIRECTORIES: ['content'],
    },
    '#lib/conf/config.js': configMock,
  })

  const result = checkStaleBuild()

  t.true(result.ok)
  t.regex(result.message, /up to date/)
})

test('checkStaleBuild returns warning when source is newer than build beyond threshold', async (t) => {
  const { sandbox } = t.context

  const buildTime = Date.now() - TWO_HOURS
  const sourceTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('_site').returns(true)
  existsSync.withArgs('content').returns(true)
  existsSync.returns(false)

  // Use path.join for cross-platform compatibility
  const filePath = path.join('content', 'file.md')
  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: buildTime })
  statSync.withArgs(filePath).returns({ mtimeMs: sourceTime })

  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync,
      statSync,
      readdirSync: sandbox.stub().returns([
        { name: 'file.md', isDirectory: () => false },
      ]),
    },
    '#lib/project/index.js': {
      SOURCE_DIRECTORIES: ['content'],
    },
    '#lib/conf/config.js': configMock,
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /older than source files/)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})

test('checkStaleBuild returns ok when source is newer but within threshold', async (t) => {
  const { sandbox } = t.context

  const buildTime = Date.now() - TEN_MINUTES
  const sourceTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('_site').returns(true)
  existsSync.withArgs('content').returns(true)
  existsSync.returns(false)

  const filePath = path.join('content', 'file.md')
  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: buildTime })
  statSync.withArgs(filePath).returns({ mtimeMs: sourceTime })

  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync,
      statSync,
      readdirSync: sandbox.stub().returns([
        { name: 'file.md', isDirectory: () => false },
      ]),
    },
    '#lib/project/index.js': {
      SOURCE_DIRECTORIES: ['content'],
    },
    '#lib/conf/config.js': configMock,
  })

  const result = checkStaleBuild()

  t.true(result.ok)
  t.regex(result.message, /up to date/)
})

test('checkStaleBuild respects ZERO threshold setting', async (t) => {
  const { sandbox } = t.context

  const buildTime = Date.now() - TWO_MINUTES
  const sourceTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('_site').returns(true)
  existsSync.withArgs('content').returns(true)
  existsSync.returns(false)

  const filePath = path.join('content', 'file.md')
  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: buildTime })
  statSync.withArgs(filePath).returns({ mtimeMs: sourceTime })

  // ZERO = 0ms threshold — any difference triggers warning
  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync,
      statSync,
      readdirSync: sandbox.stub().returns([
        { name: 'file.md', isDirectory: () => false },
      ]),
    },
    '#lib/project/index.js': {
      SOURCE_DIRECTORIES: ['content'],
    },
    '#lib/conf/config.js': {
      default: { get: () => 'ZERO' },
    },
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.is(result.level, 'warn')
})

test('checkStaleBuild NEVER threshold disables stale warnings', async (t) => {
  const { sandbox } = t.context

  const buildTime = Date.now() - ONE_HOUR
  const sourceTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('_site').returns(true)
  existsSync.withArgs('content').returns(true)
  existsSync.returns(false)

  const filePath = path.join('content', 'file.md')
  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: buildTime })
  statSync.withArgs(filePath).returns({ mtimeMs: sourceTime })

  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync,
      statSync,
      readdirSync: sandbox.stub().returns([
        { name: 'file.md', isDirectory: () => false },
      ]),
    },
    '#lib/project/index.js': {
      SOURCE_DIRECTORIES: ['content'],
    },
    '#lib/conf/config.js': {
      default: { get: () => 'NEVER' },
    },
  })

  const result = checkStaleBuild()

  t.true(result.ok)
  t.regex(result.message, /up to date/)
})

test('checkStaleBuild includes remediation with build commands', async (t) => {
  const { sandbox } = t.context

  const buildTime = Date.now() - TWO_HOURS
  const sourceTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('_site').returns(true)
  existsSync.withArgs('content').returns(true)
  existsSync.returns(false)

  // Use path.join for cross-platform compatibility
  const filePath = path.join('content', 'page.md')
  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: buildTime })
  statSync.withArgs(filePath).returns({ mtimeMs: sourceTime })

  const { checkStaleBuild } = await esmock('./stale-build.js', {
    'node:fs': {
      existsSync,
      statSync,
      readdirSync: sandbox.stub().returns([
        { name: 'page.md', isDirectory: () => false },
      ]),
    },
    '#lib/project/index.js': {
      SOURCE_DIRECTORIES: ['content'],
    },
    '#lib/conf/config.js': configMock,
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.regex(result.remediation, /quire build/)
  t.regex(result.remediation, /quire preview/)
})
