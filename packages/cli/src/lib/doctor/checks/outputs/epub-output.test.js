import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkEpubOutput returns N/A when no EPUB files exist', async (t) => {
  const { sandbox } = t.context

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/project/output-paths.js': {
      getEpubOutputPaths: () => ['epubjs.epub', 'pandoc.epub'],
    },
  })

  const result = checkEpubOutput()

  t.true(result.ok)
  t.is(result.level, 'na', 'should return N/A level when no EPUB output')
  t.regex(result.message, /No EPUB output found/)
})

test('checkEpubOutput includes remediation when no output found', async (t) => {
  const { sandbox } = t.context

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/project/output-paths.js': {
      getEpubOutputPaths: () => ['epubjs.epub', 'pandoc.epub'],
    },
  })

  const result = checkEpubOutput()

  t.truthy(result.remediation)
  t.regex(result.remediation, /quire epub/)
  t.regex(result.remediation, /failed/)
  t.truthy(result.docsUrl)
})

test('checkEpubOutput returns ok when .epub exists but no _site', async (t) => {
  const { sandbox } = t.context

  const existsSync = sandbox.stub()
  existsSync.withArgs('epubjs.epub').returns(true)
  existsSync.withArgs('pandoc.epub').returns(false)
  existsSync.withArgs('_site').returns(false)

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
    },
    '#lib/project/output-paths.js': {
      getEpubOutputPaths: () => ['epubjs.epub', 'pandoc.epub'],
    },
  })

  const result = checkEpubOutput()

  t.true(result.ok)
  t.regex(result.message, /epubjs\.epub exists/)
  t.regex(result.message, /no _site to compare/)
})

test('checkEpubOutput returns ok when .epub is up to date', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const epubTime = now // EPUB is current
  const siteTime = now - 60000 // _site is older

  const existsSync = sandbox.stub()
  existsSync.withArgs('epubjs.epub').returns(true)
  existsSync.withArgs('pandoc.epub').returns(false)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('epubjs.epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
    '#lib/project/output-paths.js': {
      getEpubOutputPaths: () => ['epubjs.epub', 'pandoc.epub'],
    },
  })

  const result = checkEpubOutput()

  t.true(result.ok)
  t.regex(result.message, /epubjs\.epub up to date/)
})

test('checkEpubOutput returns warning when .epub is stale', async (t) => {
  const { sandbox } = t.context

  const epubTime = Date.now() - 3600000 // 1 hour ago
  const siteTime = Date.now() // now

  const existsSync = sandbox.stub()
  existsSync.withArgs('epubjs.epub').returns(true)
  existsSync.withArgs('pandoc.epub').returns(false)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('epubjs.epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
    '#lib/project/output-paths.js': {
      getEpubOutputPaths: () => ['epubjs.epub', 'pandoc.epub'],
    },
  })

  const result = checkEpubOutput()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /epubjs\.epub/)
  t.regex(result.message, /older than _site/)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})

test('checkEpubOutput includes remediation with epub command', async (t) => {
  const { sandbox } = t.context

  const epubTime = Date.now() - 60000
  const siteTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('epubjs.epub').returns(true)
  existsSync.withArgs('pandoc.epub').returns(false)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('epubjs.epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
    '#lib/project/output-paths.js': {
      getEpubOutputPaths: () => ['epubjs.epub', 'pandoc.epub'],
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
  existsSync.withArgs('epubjs.epub').returns(true)
  existsSync.withArgs('pandoc.epub').returns(false)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('epubjs.epub').returns({ mtimeMs: epubTime })

  const { checkEpubOutput } = await esmock('./epub-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
    '#lib/project/output-paths.js': {
      getEpubOutputPaths: () => ['epubjs.epub', 'pandoc.epub'],
    },
  })

  const result = checkEpubOutput()

  t.regex(result.docsUrl, /epub/)
})
