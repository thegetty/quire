import esmock from 'esmock'
import path from 'node:path'
import sinon from 'sinon'
import test from 'ava'

/**
 * Paged.js PDF Engine Integration Tests
 *
 * Tests error handling paths that are difficult to trigger in E2E tests.
 * The happy path is covered by E2E tests with real Paged.js/Puppeteer.
 */

/**
 * Create a cross-platform absolute path for testing
 * @param {...string} segments - Path segments to join
 * @returns {string} Platform-appropriate absolute path
 */
function testPath(...segments) {
  const root = process.platform === 'win32' ? 'C:\\' : '/'
  return path.join(root, ...segments)
}

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()

  // Mock reporter
  t.context.mockReporter = {
    update: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }

  // Mock processManager
  t.context.mockProcessManager = {
    onShutdown: t.context.sandbox.stub(),
    onShutdownComplete: t.context.sandbox.stub()
  }

  // Mock fs-extra
  t.context.mockFs = {
    existsSync: t.context.sandbox.stub().returns(true),
    mkdirsSync: t.context.sandbox.stub(),
    promises: {
      writeFile: t.context.sandbox.stub().resolves()
    }
  }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

/**
 * Create a mock Printer instance
 */
function createMockPrinter(sandbox, options = {}) {
  const mockPrinter = {
    on: sandbox.stub(),
    close: sandbox.stub(),
    pdf: options.pdf || sandbox.stub().resolves(Buffer.from([1, 2, 3])),
    browser: {
      pages: options.pages || sandbox.stub().resolves([{
        evaluate: sandbox.stub().resolves({})
      }])
    }
  }
  return mockPrinter
}

// ─────────────────────────────────────────────────────────────────────────────
// Error handling tests
// ─────────────────────────────────────────────────────────────────────────────

test('throws PdfGenerationError when PDF rendering fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const mockPrinter = createMockPrinter(sandbox, {
    pdf: sandbox.stub().rejects(new Error('Puppeteer crashed: out of memory'))
  })

  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const error = await t.throwsAsync(() =>
    paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), {})
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Paged.js'))
  t.true(error.message.includes('PDF rendering'))
  t.true(error.message.includes('out of memory'))
})

test('throws PdfGenerationError when page map extraction fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const mockPrinter = createMockPrinter(sandbox, {
    pages: sandbox.stub().rejects(new Error('Browser context destroyed'))
  })

  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const error = await t.throwsAsync(() =>
    paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), {})
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Paged.js'))
  t.true(error.message.includes('page map extraction'))
  t.true(error.message.includes('Browser context destroyed'))
})

test('throws PdfGenerationError when cover PDF rendering fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  // Main printer succeeds
  const mainPrinter = createMockPrinter(sandbox)

  // Cover printer fails
  const coverPrinter = createMockPrinter(sandbox, {
    pdf: sandbox.stub().rejects(new Error('Cover page timeout'))
  })

  let printerCallCount = 0
  const MockPrinter = sandbox.stub().callsFake(() => {
    printerCallCount++
    return printerCallCount === 1 ? mainPrinter : coverPrinter
  })

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  // Enable cover page generation
  const options = {
    pdfConfig: { pagePDF: { coverPage: true } }
  }

  const error = await t.throwsAsync(() =>
    paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), options)
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Paged.js'))
  t.true(error.message.includes('cover PDF rendering'))
  t.true(error.message.includes('Cover page timeout'))
  // Verify cover printer was closed on error
  t.true(coverPrinter.close.called)
})

test('throws PdfGenerationError when cover page map extraction fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  // Main printer succeeds
  const mainPrinter = createMockPrinter(sandbox)

  // Cover printer PDF succeeds but pages() fails
  const coverPrinter = createMockPrinter(sandbox, {
    pages: sandbox.stub().rejects(new Error('Cover browser crashed'))
  })

  let printerCallCount = 0
  const MockPrinter = sandbox.stub().callsFake(() => {
    printerCallCount++
    return printerCallCount === 1 ? mainPrinter : coverPrinter
  })

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const options = {
    pdfConfig: { pagePDF: { coverPage: true } }
  }

  const error = await t.throwsAsync(() =>
    paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), options)
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Paged.js'))
  t.true(error.message.includes('cover page map extraction'))
  t.true(error.message.includes('Cover browser crashed'))
  t.true(coverPrinter.close.called)
})

test('throws PdfGenerationError when PDF file write fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager } = t.context

  const mockPrinter = createMockPrinter(sandbox)
  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const mockFs = {
    existsSync: sandbox.stub().returns(false),
    mkdirsSync: sandbox.stub().throws(new Error('EACCES: permission denied')),
    promises: { writeFile: sandbox.stub() }
  }

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const error = await t.throwsAsync(() =>
    paged.default(testPath('input.html'), testPath('covers.html'), testPath('restricted', 'output.pdf'), {})
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Paged.js'))
  t.true(error.message.includes('PDF file write'))
  t.true(error.message.includes('permission denied'))
})

test('closes printer on successful completion when not in debug mode', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const mockPrinter = createMockPrinter(sandbox)
  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager },
    './split.js': { splitPdf: sandbox.stub().resolves({}) }
  })

  await paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), { debug: false })

  t.true(mockPrinter.close.called)
  t.true(mockProcessManager.onShutdownComplete.calledWith('pagedjs'))
})

test('keeps printer open when in debug mode', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const mockPrinter = createMockPrinter(sandbox)
  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager },
    './split.js': { splitPdf: sandbox.stub().resolves({}) }
  })

  await paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), { debug: true })

  t.false(mockPrinter.close.called)
})

test('registers console event handler for browser warnings and errors', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const mockPrinter = createMockPrinter(sandbox)
  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager },
    '#debug': { default: mockCreateDebug },
    './split.js': { splitPdf: sandbox.stub().resolves({}) }
  })

  await paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), {})

  // Verify console handler was registered
  const consoleHandler = mockPrinter.on.getCalls().find(call => call.args[0] === 'console')
  t.truthy(consoleHandler, 'console event handler should be registered')

  // Simulate console warning
  const handler = consoleHandler.args[1]
  handler('warning', 'CSS property not supported')

  t.true(mockDebug.calledWith('browser %s: %s', 'warning', 'CSS property not supported'))
})

test('logs browser errors via debug', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const mockPrinter = createMockPrinter(sandbox)
  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager },
    '#debug': { default: mockCreateDebug },
    './split.js': { splitPdf: sandbox.stub().resolves({}) }
  })

  await paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), {})

  // Get console handler
  const consoleHandler = mockPrinter.on.getCalls().find(call => call.args[0] === 'console')
  const handler = consoleHandler.args[1]

  // Simulate console error
  handler('error', 'Script error:', 'undefined is not a function')

  t.true(mockDebug.calledWith('browser %s: %s', 'error', 'Script error: undefined is not a function'))
})

test('ignores non-warning/error console messages', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const mockPrinter = createMockPrinter(sandbox)
  const MockPrinter = sandbox.stub().returns(mockPrinter)

  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const paged = await esmock('./paged.js', {
    'pagedjs-cli': MockPrinter,
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager },
    '#debug': { default: mockCreateDebug },
    './split.js': { splitPdf: sandbox.stub().resolves({}) }
  })

  await paged.default(testPath('input.html'), testPath('covers.html'), testPath('output.pdf'), {})

  // Get console handler
  const consoleHandler = mockPrinter.on.getCalls().find(call => call.args[0] === 'console')
  const handler = consoleHandler.args[1]

  // Reset debug stub to check only calls after handler invocation
  mockDebug.resetHistory()

  // Simulate console log (should be ignored)
  handler('log', 'Debug info')

  // Should not have logged this message (info/log messages are ignored)
  t.false(mockDebug.calledWith('browser %s: %s', 'log', 'Debug info'))
})
