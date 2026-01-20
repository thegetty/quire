import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkEpubOutput returns N/A when no _epub directory exists', async (t) => {
  const { sandbox } = t.context

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
  })

  const result = checkEpubOutput()

  t.true(result.ok)
  t.is(result.level, 'na', 'should return N/A level when no EPUB output')
  t.regex(result.message, /No EPUB output/)
})

test('checkEpubOutput returns ok when _epub exists but no _site', async (t) => {
  const { sandbox } = t.context

  const existsSync = sandbox.stub()
  existsSync.withArgs('_epub').returns(true)
  existsSync.withArgs('_site').returns(false)

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
    },
  })

  const result = checkEpubOutput()

  t.true(result.ok)
  t.regex(result.message, /_epub exists/)
  t.regex(result.message, /no _site to compare/)
})

test('checkEpubOutput returns ok when _epub is up to date', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const epubTime = now // EPUB is current
  const siteTime = now - 60000 // _site is older

  const existsSync = sandbox.stub()
  existsSync.withArgs('_epub').returns(true)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('_epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkEpubOutput()

  t.true(result.ok)
  t.regex(result.message, /_epub up to date/)
})

test('checkEpubOutput returns warning when _epub is stale', async (t) => {
  const { sandbox } = t.context

  const epubTime = Date.now() - 3600000 // 1 hour ago
  const siteTime = Date.now() // now

  const existsSync = sandbox.stub()
  existsSync.withArgs('_epub').returns(true)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('_epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkEpubOutput()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /_epub/)
  t.regex(result.message, /older than _site/)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})

test('checkEpubOutput includes remediation with epub command', async (t) => {
  const { sandbox } = t.context

  const epubTime = Date.now() - 60000
  const siteTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('_epub').returns(true)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('_epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkEpubOutput()

  t.false(result.ok)
  t.regex(result.remediation, /quire epub/)
})

test('checkEpubOutput uses correct docsUrl', async (t) => {
  const { sandbox } = t.context

  const epubTime = Date.now() - 60000
  const siteTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('_epub').returns(true)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('_epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkEpubOutput()

  t.regex(result.docsUrl, /epub/)
})
