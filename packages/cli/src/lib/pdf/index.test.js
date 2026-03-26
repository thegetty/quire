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

/**
 * Create a cross-platform absolute path for testing
 * Uses platform-appropriate root (C:\ on Windows, / on Unix)
 * @param {...string} segments - Path segments to join
 * @returns {string} Platform-appropriate absolute path
 */
function testPath(...segments) {
  const root = process.platform === 'win32' ? 'C:\\' : '/'
  return path.join(root, ...segments)
}

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
    getProjectRoot: () => testPath('project'),
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
    getProjectRoot: () => testPath('project'),
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

  const mockWhich = sandbox.stub().returns('/usr/local/bin/prince')

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#helpers/which.js': { default: mockWhich },
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
    getProjectRoot: () => testPath('project'),
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

  const mockWhich = sandbox.stub().returns('/usr/local/bin/prince')

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#helpers/which.js': { default: mockWhich },
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
    getProjectRoot: () => testPath('project'),
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
// Engine availability tests
// ─────────────────────────────────────────────────────────────────────────────

test('generatePdf throws ToolNotFoundError when prince is not in PATH', async (t) => {
  const { sandbox } = t.context

  const mockReporter = {
    start: sandbox.stub().returnsThis(),
    update: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    detail: sandbox.stub().returnsThis()
  }

  // Import the actual ToolNotFoundError to throw from mock
  const { ToolNotFoundError } = await import('#src/errors/index.js')

  // Mock which to throw ToolNotFoundError (simulating prince not found)
  const mockWhich = sandbox.stub().callsFake((executable, toolInfo) => {
    throw new ToolNotFoundError(executable, toolInfo)
  })

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => testPath('project'), getOutputDir: () => '_site' },
      loadProjectConfig: sandbox.stub()
    },
    'fs-extra': { existsSync: sandbox.stub() },
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const error = await t.throwsAsync(() => generatePdf.default({ lib: 'prince' }))

  t.is(error.code, 'TOOL_NOT_FOUND')
  t.true(error.message.includes('PrinceXML'))
  t.true(error.suggestion.includes('princexml.com'))
  t.true(error.suggestion.includes('pagedjs')) // Fallback suggestion
  // Reporter should NOT have been started (fail fast before spinner)
  t.false(mockReporter.start.called)
})

test('generatePdf does not check binary for pagedjs (built-in engine)', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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

  const mockWhich = sandbox.stub().throws(new Error('which should not be called for pagedjs'))

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#helpers/which.js': { default: mockWhich },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  // Should not throw - pagedjs doesn't require an external binary
  await t.notThrowsAsync(() => generatePdf.default({ lib: 'pagedjs' }))
  // which should not have been called
  t.false(mockWhich.called)
})

test('generatePdf succeeds when prince is in PATH', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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

  const mockWhich = sandbox.stub().returns('/usr/local/bin/prince') // Prince found

  const generatePdf = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#helpers/which.js': { default: mockWhich },
    '#lib/project/index.js': {
      default: mockPaths,
      loadProjectConfig: sandbox.stub().resolves({ pdf: null })
    },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  // Should succeed when prince is found
  await t.notThrowsAsync(() => generatePdf.default({ lib: 'prince' }))
  t.true(mockWhich.calledWith('prince', sinon.match.object))
  t.true(mockReporter.start.called)
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
      default: { getProjectRoot: () => testPath('project'), getOutputDir: () => '_site' },
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
    getProjectRoot: () => testPath('project'),
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
    getProjectRoot: () => testPath('project'),
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

  t.is(output, path.join(testPath('project'), '_site', '_downloads', 'my-publication.pdf'))
})

test('generatePdf uses fallback output path when no pdf config', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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

  t.is(output, path.join(testPath('project'), 'pagedjs.pdf'))
})

test('generatePdf uses --output option when provided (absolute path)', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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

  const customPath = testPath('custom', 'path', 'book.pdf')
  const output = await generatePdf.default({ lib: 'pagedjs', output: customPath })

  t.is(output, customPath)
  // Verify the custom path was passed to the PDF library
  const [, , pdfPath] = mockPdfLib.firstCall.args
  t.is(pdfPath, customPath)
})

test('generatePdf uses --output option when provided (relative path)', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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

  const output = await generatePdf.default({ lib: 'pagedjs', output: 'output/my-book.pdf' })

  // Relative path should be resolved against project root
  t.is(output, path.join(testPath('project'), 'output/my-book.pdf'))
})

test('generatePdf --output option overrides pdf config', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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
    filename: 'configured-name'
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

  const output = await generatePdf.default({ lib: 'pagedjs', output: 'custom.pdf' })

  // --output should override the config path
  t.is(output, path.join(testPath('project'), 'custom.pdf'))
  // Default would have been: {projectRoot}/_site/_downloads/configured-name.pdf
})

// ─────────────────────────────────────────────────────────────────────────────
// PDF library invocation tests
// ─────────────────────────────────────────────────────────────────────────────

test('generatePdf passes correct arguments to PDF library', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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
  t.is(input, path.join(testPath('project'), '_site', 'pdf.html'))
  t.is(covers, path.join(testPath('project'), '_site', 'pdf-covers.html'))
  t.is(output, path.join(testPath('project'), '_site', '_downloads', 'publication.pdf'))
  t.true(options.debug)
  t.deepEqual(options.pdfConfig, pdfConfig)
})

test('generatePdf passes options through to PDF library', async (t) => {
  const { sandbox } = t.context

  const mockPdfLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockPdfLib })

  const mockPaths = {
    getProjectRoot: () => testPath('project'),
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
