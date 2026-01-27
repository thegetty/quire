import test from 'ava'
import path from 'node:path'
import sinon from 'sinon'
import esmock from 'esmock'

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

test('checkPdfOutput returns N/A when no PDF files exist', async (t) => {
  const { sandbox } = t.context

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
    '#lib/conf/build-status.js': buildStatusMock,
  })

  const result = await checkPdfOutput()

  t.true(result.ok)
  t.is(result.level, 'na', 'should return N/A level when no PDF output')
  t.regex(result.message, /No PDF output found/)
})

test('checkPdfOutput includes remediation when no output found', async (t) => {
  const { sandbox } = t.context

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
    '#lib/conf/build-status.js': buildStatusMock,
  })

  const result = await checkPdfOutput()

  t.truthy(result.remediation)
  t.regex(result.remediation, /quire pdf/)
  t.regex(result.remediation, /failed/)
  t.truthy(result.docsUrl)
})

test('checkPdfOutput returns failure when last PDF generation failed and no output exists', async (t) => {
  const { sandbox } = t.context

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
    '#lib/conf/build-status.js': {
      getStatus: () => ({ status: 'failed', timestamp: Date.now() }),
    },
  })

  const result = await checkPdfOutput()

  t.false(result.ok)
  t.is(result.level, undefined)
  t.regex(result.message, /Last PDF generation failed/)
  t.truthy(result.remediation)
  t.regex(result.remediation, /quire pdf --debug/)
  t.truthy(result.docsUrl)
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
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
  })

  const result = await checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /pagedjs\.pdf exists/)
  t.regex(result.message, /no _site to compare/)
})

test('checkPdfOutput returns ok when PDF is up to date', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const pdfTime = now // PDF is current
  const siteTime = now - TEN_MINUTES // _site is older

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
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
  })

  const result = await checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /pagedjs\.pdf up to date/)
})

test('checkPdfOutput returns warning when PDF is stale beyond threshold', async (t) => {
  const { sandbox } = t.context

  const pdfTime = Date.now() - TWO_HOURS // 2 hours ago
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
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
  })

  const result = await checkPdfOutput()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /pagedjs\.pdf/)
  t.regex(result.message, /older than _site/)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})

test('checkPdfOutput returns ok when PDF is stale but within threshold', async (t) => {
  const { sandbox } = t.context

  const pdfTime = Date.now() - TWO_MINUTES // 2 minutes ago
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
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
  })

  const result = await checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /pagedjs\.pdf up to date/)
})

test('checkPdfOutput checks multiple PDF files', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const pdfTime = now
  const siteTime = now - TEN_MINUTES

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
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
  })

  const result = await checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /pagedjs\.pdf/)
  t.regex(result.message, /prince\.pdf/)
})

test('checkPdfOutput includes remediation with pdf command', async (t) => {
  const { sandbox } = t.context

  const pdfTime = Date.now() - TWO_HOURS
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
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: () => ['pagedjs.pdf', 'prince.pdf'],
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({}),
    },
    '#lib/conf/config.js': configMock,
  })

  const result = await checkPdfOutput()

  t.false(result.ok)
  t.regex(result.remediation, /quire pdf/)
})

test('checkPdfOutput loads project config to resolve config-aware paths', async (t) => {
  const { sandbox } = t.context

  const pdfConfig = { outputDir: 'pdf', filename: 'my-publication' }
  const configPath = path.join('_site', 'pdf', 'my-publication.pdf')

  const existsSync = sandbox.stub().returns(false)
  existsSync.withArgs(configPath).returns(true)
  existsSync.withArgs('_site').returns(true)

  const now = Date.now()
  const statSync = sandbox.stub()
  statSync.withArgs('_site').returns({ mtimeMs: now - TEN_MINUTES })
  statSync.withArgs(configPath).returns({ mtimeMs: now })

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync,
      statSync,
    },
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: (opts) => {
        const paths = []
        if (opts.pdfConfig) {
          paths.push(configPath)
        }
        paths.push('pagedjs.pdf', 'prince.pdf')
        return paths
      },
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => ({ pdf: pdfConfig }),
    },
    '#lib/conf/config.js': configMock,
  })

  const result = await checkPdfOutput()

  t.true(result.ok)
  t.regex(result.message, /my-publication\.pdf up to date/)
})

test('checkPdfOutput falls back to engine defaults when config loading fails', async (t) => {
  const { sandbox } = t.context

  const { checkPdfOutput } = await esmock('./pdf-output.js', {
    'node:fs': {
      existsSync: sandbox.stub().returns(false),
    },
    '#lib/project/output-paths.js': {
      getPdfOutputPaths: (opts) => {
        t.is(opts.pdfConfig, undefined, 'pdfConfig should be undefined when config fails')
        return ['pagedjs.pdf', 'prince.pdf']
      },
    },
    '#lib/project/config.js': {
      loadProjectConfig: async () => { throw new Error('No config.yaml') },
    },
    '#lib/conf/config.js': configMock,
    '#lib/conf/build-status.js': buildStatusMock,
  })

  const result = await checkPdfOutput()

  t.true(result.ok)
  t.is(result.level, 'na')
})
