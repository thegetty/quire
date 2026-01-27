import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'
import path from 'node:path'

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
  })

  const result = checkStaleBuild()

  t.true(result.ok)
  t.regex(result.message, /up to date/)
})

test('checkStaleBuild returns warning when source is newer than build', async (t) => {
  const { sandbox } = t.context

  const buildTime = Date.now() - 60000 // 1 minute ago
  const sourceTime = Date.now() // now

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
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /older than source files/)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})

test('checkStaleBuild includes remediation with build commands', async (t) => {
  const { sandbox } = t.context

  const buildTime = Date.now() - 3600000 // 1 hour ago
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
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.regex(result.remediation, /quire build/)
  t.regex(result.remediation, /quire preview/)
})
