import esmock from 'esmock'
import path from 'node:path'
import sinon from 'sinon'
import test from 'ava'

/**
 * EPUB Module Integration Tests
 *
 * Tests the EPUB generation façade module behavior with mocked dependencies.
 * Uses esmock to isolate the module from file system and external EPUB tools.
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

test('generateEpub resolves epubjs library correctly', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generateEpub.default({ lib: 'epubjs' })

  t.true(mockDynamicImport.calledOnce)
  t.true(mockDynamicImport.firstCall.args[0].includes('epub.js'))
  t.true(mockReporter.start.calledWith(sinon.match(/Epub\.js/)))
})

test('generateEpub resolves pandoc library correctly', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })
  const mockWhich = sandbox.stub().returns('/usr/local/bin/pandoc')

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#helpers/which.js': { default: mockWhich },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generateEpub.default({ lib: 'pandoc' })

  t.true(mockDynamicImport.firstCall.args[0].includes('pandoc.js'))
  t.true(mockReporter.start.calledWith(sinon.match(/Pandoc/)))
})

test('generateEpub normalizes library name variations', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })
  const mockWhich = sandbox.stub().returns('/usr/local/bin/pandoc')

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#helpers/which.js': { default: mockWhich },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  // Test "epub-js" variant (with hyphen)
  await generateEpub.default({ lib: 'epub-js' })
  t.true(mockDynamicImport.firstCall.args[0].includes('epub.js'))

  // Test "PANDOC" variant (uppercase)
  mockDynamicImport.resetHistory()
  await generateEpub.default({ lib: 'PANDOC' })
  t.true(mockDynamicImport.firstCall.args[0].includes('pandoc.js'))
})

test('generateEpub defaults to epubjs when no library specified', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generateEpub.default({})

  t.true(mockDynamicImport.firstCall.args[0].includes('epub.js'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Error handling tests
// ─────────────────────────────────────────────────────────────────────────────

test('generateEpub throws InvalidEpubLibraryError for unrecognized library', async (t) => {
  const { sandbox } = t.context

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() },
    '#lib/project/index.js': mockPaths,
    'fs-extra': { existsSync: sandbox.stub(), mkdirSync: sandbox.stub() },
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const error = await t.throwsAsync(() => generateEpub.default({ lib: 'unknown-library' }))

  t.is(error.code, 'INVALID_EPUB_LIBRARY')
  t.true(error.message.includes('unknown-library'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Output path tests
// ─────────────────────────────────────────────────────────────────────────────

test('generateEpub uses default output path based on library name', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const output = await generateEpub.default({ lib: 'epubjs' })

  t.is(output, path.join('/project', 'epubjs.epub'))
})

test('generateEpub uses custom output path when provided', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const output = await generateEpub.default({ lib: 'epubjs', output: 'my-book.epub' })

  t.is(output, path.join('/project', 'my-book.epub'))
})

test('generateEpub resolves relative output path against project root', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const output = await generateEpub.default({ lib: 'epubjs', output: '_downloads/book' })

  t.is(output, path.join('/project', '_downloads', 'book.epub'))
})

test('generateEpub uses absolute output path directly', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const output = await generateEpub.default({ lib: 'epubjs', output: '/custom/path/book.epub' })

  t.is(output, '/custom/path/book.epub')
})

test('generateEpub adds .epub extension if missing', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  const output = await generateEpub.default({ lib: 'epubjs', output: 'my-book' })

  t.is(output, path.join('/project', 'my-book.epub'))
})

test('generateEpub creates output directory if missing', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(false),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generateEpub.default({ lib: 'epubjs', output: '_downloads/book.epub' })

  t.true(mockFs.mkdirSync.calledOnce)
  t.is(mockFs.mkdirSync.firstCall.args[0], path.join('/project', '_downloads'))
  t.deepEqual(mockFs.mkdirSync.firstCall.args[1], { recursive: true })
})

// ─────────────────────────────────────────────────────────────────────────────
// EPUB library invocation tests
// ─────────────────────────────────────────────────────────────────────────────

test('generateEpub passes correct arguments to EPUB library', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generateEpub.default({ lib: 'epubjs', debug: true })

  t.true(mockEpubLib.calledOnce)
  const [input, output, options] = mockEpubLib.firstCall.args
  t.is(input, path.join('/project', '_epub'))
  t.is(output, path.join('/project', 'epubjs.epub'))
  t.true(options.debug)
})

test('generateEpub passes options through to EPUB library', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const mockPaths = {
    getProjectRoot: () => '/project',
    getEpubDir: () => '_epub'
  }

  const mockFs = {
    existsSync: sandbox.stub().returns(true),
    mkdirSync: sandbox.stub()
  }

  const mockReporter = {
    start: sandbox.stub(),
    detail: sandbox.stub(),
    succeed: sandbox.stub(),
    fail: sandbox.stub()
  }

  const generateEpub = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport },
    '#lib/project/index.js': mockPaths,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter }
  })

  await generateEpub.default({
    lib: 'epubjs',
    debug: true,
    customOption: 'value'
  })

  const [, , options] = mockEpubLib.firstCall.args
  t.true(options.debug)
  t.is(options.customOption, 'value')
})
