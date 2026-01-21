import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * Prince PDF Engine Integration Tests
 *
 * Tests error handling paths that are difficult to trigger in E2E tests.
 * The happy path is covered by E2E tests with real Prince installation.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()

  // Mock reporter to prevent actual console output
  t.context.mockReporter = {
    update: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }

  // Mock processManager
  t.context.mockProcessManager = {
    signal: new AbortController().signal
  }

  // Mock fs-extra
  t.context.mockFs = {
    existsSync: t.context.sandbox.stub().returns(true),
    mkdirsSync: t.context.sandbox.stub(),
    readFileSync: t.context.sandbox.stub().returns(Buffer.from([1, 2, 3])),
    promises: {
      writeFile: t.context.sandbox.stub().resolves()
    }
  }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// Error handling tests
// ─────────────────────────────────────────────────────────────────────────────

test('throws PdfGenerationError when page map generation fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const execaError = new Error('Prince failed')
  execaError.stderr = 'error: invalid HTML at line 42'

  const prince = await esmock('./prince.js', {
    execa: { execa: sandbox.stub().rejects(execaError) },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const error = await t.throwsAsync(() =>
    prince.default('/input.html', '/covers.html', '/output.pdf', {})
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Prince'))
  t.true(error.message.includes('page map generation'))
  t.true(error.message.includes('invalid HTML at line 42'))
})

test('throws PdfGenerationError when PDF printing fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  // First call (page map) succeeds, second call (print) fails
  const execaStub = sandbox.stub()
  execaStub.onCall(0).resolves({ stdout: '{}' }) // page map succeeds
  const printError = new Error('Prince print failed')
  printError.stderr = 'error: out of memory'
  execaStub.onCall(1).rejects(printError)

  const prince = await esmock('./prince.js', {
    execa: { execa: execaStub },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const error = await t.throwsAsync(() =>
    prince.default('/input.html', '/covers.html', '/output.pdf', {})
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Prince'))
  t.true(error.message.includes('PDF printing'))
  t.true(error.message.includes('out of memory'))
})

test('throws PdfGenerationError when cover page map generation fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  // First call (page map) succeeds, second call (covers) fails
  const execaStub = sandbox.stub()
  execaStub.onCall(0).resolves({ stdout: '{"page-1": {"startPage": 0}}' })
  const coversError = new Error('Prince covers failed')
  coversError.stderr = 'error: covers file corrupt'
  execaStub.onCall(1).rejects(coversError)

  const prince = await esmock('./prince.js', {
    execa: { execa: execaStub },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  // Enable cover page generation
  const options = {
    pdfConfig: { pagePDF: { coverPage: true } }
  }

  const error = await t.throwsAsync(() =>
    prince.default('/input.html', '/covers.html', '/output.pdf', options)
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Prince'))
  t.true(error.message.includes('cover page map generation'))
  t.true(error.message.includes('covers file corrupt'))
})

test('warns and returns when page map generation is cancelled', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const cancelError = new Error('Cancelled')
  cancelError.isCanceled = true

  const prince = await esmock('./prince.js', {
    execa: { execa: sandbox.stub().rejects(cancelError) },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const result = await prince.default('/input.html', '/covers.html', '/output.pdf', {})

  t.is(result, undefined)
  t.true(mockReporter.warn.calledWith('PDF generation cancelled'))
})

test('warns and returns when PDF printing is cancelled', async (t) => {
  const { sandbox, mockReporter, mockProcessManager, mockFs } = t.context

  const execaStub = sandbox.stub()
  execaStub.onCall(0).resolves({ stdout: '{}' }) // page map succeeds
  const cancelError = new Error('Cancelled')
  cancelError.isCanceled = true
  execaStub.onCall(1).rejects(cancelError)

  const prince = await esmock('./prince.js', {
    execa: { execa: execaStub },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const result = await prince.default('/input.html', '/covers.html', '/output.pdf', {})

  t.is(result, undefined)
  t.true(mockReporter.warn.calledWith('PDF generation cancelled'))
})

test('throws PdfGenerationError when output directory creation fails', async (t) => {
  const { sandbox, mockReporter, mockProcessManager } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(false),
    mkdirsSync: sandbox.stub().throws(new Error('EACCES: permission denied'))
  }

  const prince = await esmock('./prince.js', {
    execa: { execa: sandbox.stub() },
    'fs-extra': mockFs,
    '#lib/reporter/index.js': { default: mockReporter },
    '#lib/process/manager.js': { default: mockProcessManager }
  })

  const error = await t.throwsAsync(() =>
    prince.default('/input.html', '/covers.html', '/restricted/output.pdf', {})
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('Prince'))
  t.true(error.message.includes('output directory creation'))
  t.true(error.message.includes('permission denied'))
})
