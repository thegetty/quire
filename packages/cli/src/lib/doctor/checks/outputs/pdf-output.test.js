import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkPdfOutput returns N/A when no PDF files exist', async (t) => {
  const { sandbox } = t.context

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
  })

  const result = checkPdfOutput()

  t.true(result.ok)
  t.is(result.level, 'na', 'should return N/A level when no PDF output')
  t.regex(result.message, /No PDF output/)
})

test('checkPdfOutput returns ok when PDF exists but no _site', async (t) => {
  const { sandbox } = t.context

  const existsSync = sandbox.stub()
  existsSync.withArgs('pagedjs.pdf').returns(true)
  existsSync.withArgs('prince.pdf').returns(false)
  existsSync.withArgs('_site').returns(false)

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync,
    },
  })

  const result = checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /pagedjs\.pdf exists/)
  t.regex(result.message, /no _site to compare/)
})

test('checkPdfOutput returns ok when PDF is up to date', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const pdfTime = now // PDF is current
  const siteTime = now - 60000 // _site is older

  const existsSync = sandbox.stub()
  existsSync.withArgs('pagedjs.pdf').returns(true)
  existsSync.withArgs('prince.pdf').returns(false)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('pagedjs.pdf').returns({ mtimeMs: pdfTime })

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /pagedjs\.pdf up to date/)
})

test('checkPdfOutput returns warning when PDF is stale', async (t) => {
  const { sandbox } = t.context

  const pdfTime = Date.now() - 3600000 // 1 hour ago
  const siteTime = Date.now() // now

  const existsSync = sandbox.stub()
  existsSync.withArgs('pagedjs.pdf').returns(true)
  existsSync.withArgs('prince.pdf').returns(false)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('pagedjs.pdf').returns({ mtimeMs: pdfTime })

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkPdfOutput()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /pagedjs\.pdf/)
  t.regex(result.message, /older than _site/)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})

test('checkPdfOutput checks multiple PDF files', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const pdfTime = now
  const siteTime = now - 60000

  const existsSync = sandbox.stub()
  existsSync.withArgs('pagedjs.pdf').returns(true)
  existsSync.withArgs('prince.pdf').returns(true)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('pagedjs.pdf').returns({ mtimeMs: pdfTime })
  statSync.withArgs('prince.pdf').returns({ mtimeMs: pdfTime })

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /pagedjs\.pdf/)
  t.regex(result.message, /prince\.pdf/)
})

test('checkPdfOutput includes remediation with pdf command', async (t) => {
  const { sandbox } = t.context

  const pdfTime = Date.now() - 60000
  const siteTime = Date.now()

  const existsSync = sandbox.stub()
  existsSync.withArgs('pagedjs.pdf').returns(true)
  existsSync.withArgs('prince.pdf').returns(false)
  existsSync.withArgs('_site').returns(true)

  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: siteTime })
  statSync.withArgs('pagedjs.pdf').returns({ mtimeMs: pdfTime })

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
  })

  const result = checkPdfOutput()

  t.false(result.ok)
  t.regex(result.remediation, /quire pdf/)
})
