import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * EPUB Module Integration Tests
 *
 * Tests the EPUB generation façade module behavior with mocked dependencies.
 * Uses esmock to isolate the module from external EPUB tools.
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

test('getEpubLib resolves epubjs library correctly', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  const generator = await getEpubLib.default('epubjs')

  t.true(mockDynamicImport.calledOnce)
  t.true(mockDynamicImport.firstCall.args[0].includes('epub.js'))
  t.is(typeof generator, 'function')
})

test('getEpubLib resolves pandoc library correctly', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  const generator = await getEpubLib.default('pandoc')

  t.true(mockDynamicImport.firstCall.args[0].includes('pandoc.js'))
  t.is(typeof generator, 'function')
})

test('getEpubLib defaults to epubjs when no library specified', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  await getEpubLib.default()

  t.true(mockDynamicImport.firstCall.args[0].includes('epub.js'))
})

test('getEpubLib normalizes library name variations', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  // Test variations
  await getEpubLib.default('epub-js')
  t.true(mockDynamicImport.firstCall.args[0].includes('epub.js'))

  mockDynamicImport.resetHistory()
  await getEpubLib.default('PANDOC')
  t.true(mockDynamicImport.firstCall.args[0].includes('pandoc.js'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Error handling tests
// ─────────────────────────────────────────────────────────────────────────────

test('getEpubLib throws InvalidEpubLibraryError for unrecognized library', async (t) => {
  const { sandbox } = t.context

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: sandbox.stub() }
  })

  const error = await t.throwsAsync(() => getEpubLib.default('unknown-library'))

  t.is(error.code, 'INVALID_EPUB_LIBRARY')
  t.true(error.message.includes('unknown-library'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Generator function tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('returned generator calls epub library with correct arguments', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  // Capture console.info calls
  const consoleInfoStub = sandbox.stub(console, 'info')

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  const generator = await getEpubLib.default('epubjs')
  await generator('/input/path', '/output/path')

  t.true(mockEpubLib.calledOnce)
  t.is(mockEpubLib.firstCall.args[0], '/input/path')
  t.is(mockEpubLib.firstCall.args[1], '/output/path')
  t.true(consoleInfoStub.calledWith(sinon.match(/Epub\.js/)))
})

test.serial('returned generator logs library name correctly for pandoc', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  // Capture console.info calls
  const consoleInfoStub = sandbox.stub(console, 'info')

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  const generator = await getEpubLib.default('pandoc')
  await generator('/input', '/output')

  t.true(consoleInfoStub.calledWith(sinon.match(/Pandoc/)))
})

test.serial('returned generator passes empty options object to epub library', async (t) => {
  const { sandbox } = t.context

  const mockEpubLib = sandbox.stub().resolves()
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  sandbox.stub(console, 'info')

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  const generator = await getEpubLib.default('epubjs')
  await generator('/input', '/output')

  // The third argument should be the options object (empty for epub libs)
  t.deepEqual(mockEpubLib.firstCall.args[2], {})
})

test.serial('returned generator returns result from epub library', async (t) => {
  const { sandbox } = t.context

  const expectedResult = { success: true, path: '/output/book.epub' }
  const mockEpubLib = sandbox.stub().resolves(expectedResult)
  const mockDynamicImport = sandbox.stub().resolves({ default: mockEpubLib })

  sandbox.stub(console, 'info')

  const getEpubLib = await esmock('./index.js', {
    '#helpers/os-utils.js': { dynamicImport: mockDynamicImport }
  })

  const generator = await getEpubLib.default('epubjs')
  const result = await generator('/input', '/output')

  t.deepEqual(result, expectedResult)
})
