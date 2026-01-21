import esmock from 'esmock'
import path from 'node:path'
import sinon from 'sinon'
import test from 'ava'

/**
 * PDF Module Integration Tests
 *
 * Tests the PDF generation façade module behavior with mocked dependencies.
 * Uses esmock to isolate the module from file system and external PDF tools.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// Library resolution tests
// ─────────────────────────────────────────────────────────────────────────────

test('generatePdf resolves pagedjs library correctly', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generatePdf.default({ lib: 'pagedjs' })

  t.true(mockDynamicImport.calledOnce)
  t.true(mockDynamicImport.firstCall.args[0].includes('paged.js'))
  t.true(mockReporter.start.calledWith(sinon.match(/Paged\.js/)))
})

test('generatePdf resolves prince library correctly', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generatePdf.default({ lib: 'prince' })

  t.true(mockDynamicImport.firstCall.args[0].includes('prince.js'))
  t.true(mockReporter.start.calledWith(sinon.match(/Prince/)))
})

test('generatePdf normalizes library name variations', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  // Test "paged" variant
  await generatePdf.default({ lib: 'paged' })
  t.true(mockDynamicImport.firstCall.args[0].includes('paged.js'))

  // Test "princexml" variant
  mockDynamicImport.resetHistory()
  await generatePdf.default({ lib: 'princexml' })
  t.true(mockDynamicImport.firstCall.args[0].includes('prince.js'))
})

test('generatePdf defaults to pagedjs when no library specified', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generatePdf.default({})

  t.true(mockDynamicImport.firstCall.args[0].includes('paged.js'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Error handling tests
// ─────────────────────────────────────────────────────────────────────────────

test('generatePdf throws InvalidPdfLibraryError for unrecognized library', async (t) => {
  const { sandbox } = t.context

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project', getOutputDir: () => '_site' },
      loadProjectConfig: sandbox.stub()
    },
    'fs-extra': { existsSync: sandbox.stub() },
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const error = await t.throwsAsync(() => generatePdf.default({ lib: 'unknown-library' }))

  t.is(error.code, 'INVALID_PDF_LIBRARY')
  t.true(error.message.includes('unknown-library'))
})

test('generatePdf throws MissingBuildOutputError when pdf.html is missing', async (t) => {
  const { sandbox } = t.context

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(false)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const error = await t.throwsAsync(() => generatePdf.default({ lib: 'pagedjs' }))

  t.is(error.code, 'BUILD_OUTPUT_MISSING')
  t.true(error.message.includes('pdf.html'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Output path tests
// ─────────────────────────────────────────────────────────────────────────────

test('generatePdf uses pdf config for output path when available', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const pdfConfig = {
    outputDir: '_downloads',
    filename: 'my-publication'
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: pdfConfig })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const output = await generatePdf.default({ lib: 'pagedjs' })

  t.is(output, path.join('/project', '_site', '_downloads', 'my-publication.pdf'))
})

test('generatePdf uses fallback output path when no pdf config', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const output = await generatePdf.default({ lib: 'pagedjs' })

  t.is(output, path.join('/project', 'pagedjs.pdf'))
})

// ─────────────────────────────────────────────────────────────────────────────
// PDF library invocation tests
// ─────────────────────────────────────────────────────────────────────────────

test('generatePdf passes correct arguments to PDF library', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const pdfConfig = {
    outputDir: '_downloads',
    filename: 'publication'
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: pdfConfig })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generatePdf.default({ lib: 'pagedjs', debug: true })

  t.true(mockPdfLib.calledOnce)
  const [input, covers, output, options] = mockPdfLib.firstCall.args
  t.is(input, path.join('/project', '_site', 'pdf.html'))
  t.is(covers, path.join('/project', '_site', 'pdf-covers.html'))
  t.is(output, path.join('/project', '_site', '_downloads', 'publication.pdf'))
  t.true(options.debug)
  t.deepEqual(options.pdfConfig, pdfConfig)
})

test('generatePdf passes options through to PDF library', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generatePdf.default({
    lib: 'pagedjs',
    debug: true,
    customOption: 'value'
  })

  const [, , , options] = mockPdfLib.firstCall.args
  t.true(options.debug)
  t.is(options.customOption, 'value')
})
