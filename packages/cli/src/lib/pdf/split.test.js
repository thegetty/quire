import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * PDF Split Module Unit Tests
 *
 * Tests the PDF splitting utility that extracts sections from a PDF
 * based on a page map. Uses mocked pdf-lib to avoid needing real PDF fixtures.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

/**
 * Create a mock PDFDocument with configurable page count
 */
function createMockPdfDoc(sandbox, pageCount = 10) {
  const mockDoc = {
    getPageCount: sandbox.stub().returns(pageCount),
    copy: sandbox.stub(),
    copyPages: sandbox.stub(),
    removePage: sandbox.stub(),
    insertPage: sandbox.stub(),
    save: sandbox.stub().resolves(new Uint8Array([1, 2, 3]))
  }
  // copy() returns a new mock that shares the same page count
  mockDoc.copy.resolves({
    getPageCount: () => pageCount,
    removePage: mockDoc.removePage,
    copyPages: mockDoc.copyPages,
    insertPage: mockDoc.insertPage,
    save: mockDoc.save
  })
  mockDoc.copyPages.resolves([{ /* mock cover page */ }])
  return mockDoc
}

// ─────────────────────────────────────────────────────────────────────────────
// Basic behavior tests
// ─────────────────────────────────────────────────────────────────────────────

test('splitPdf returns empty object when pdfConfig is null', async (t) => {
  const { sandbox } = t.context

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub() } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const result = await splitPdf(Buffer.from([]), undefined, {}, null)

  t.deepEqual(result, {})
})

test('splitPdf returns empty object when pdfConfig is undefined', async (t) => {
  const { sandbox } = t.context

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub() } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const result = await splitPdf(Buffer.from([]), undefined, {}, undefined)

  t.deepEqual(result, {})
})

test('splitPdf returns empty object when pageMap is empty', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pdfConfig = { filename: 'book', outputDir: '_downloads' }
  const result = await splitPdf(Buffer.from([]), undefined, {}, pdfConfig)

  t.deepEqual(result, {})
})

// ─────────────────────────────────────────────────────────────────────────────
// Section extraction tests
// ─────────────────────────────────────────────────────────────────────────────

test('splitPdf extracts single section from pageMap', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-intro': { startPage: 0, endPage: 2 }
  }
  const pdfConfig = { filename: 'publication', outputDir: '_downloads' }

  const result = await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  t.is(Object.keys(result).length, 1)
  const filePath = Object.keys(result)[0]
  t.true(filePath.includes('publication-intro.pdf'))
  t.true(filePath.includes('_downloads'))
})

test('splitPdf extracts multiple sections from pageMap', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 20)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-intro': { startPage: 0, endPage: 2 },
    'page-chapter1': { startPage: 3, endPage: 8 },
    'page-chapter2': { startPage: 9, endPage: 15 }
  }
  const pdfConfig = { filename: 'book', outputDir: 'pdf' }

  const result = await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  t.is(Object.keys(result).length, 3)
  const filePaths = Object.keys(result)
  t.true(filePaths.some(p => p.includes('book-intro.pdf')))
  t.true(filePaths.some(p => p.includes('book-chapter1.pdf')))
  t.true(filePaths.some(p => p.includes('book-chapter2.pdf')))
})

test('splitPdf strips "page-" prefix from section IDs', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-my-section': { startPage: 0, endPage: 5 }
  }
  const pdfConfig = { filename: 'doc', outputDir: 'out' }

  const result = await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  const filePath = Object.keys(result)[0]
  t.true(filePath.includes('doc-my-section.pdf'))
  t.false(filePath.includes('page-'))
})

test('splitPdf removes pages outside section range', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)
  const removePage = sandbox.stub()
  mockDoc.copy.resolves({
    getPageCount: () => 10,
    removePage,
    copyPages: mockDoc.copyPages,
    insertPage: mockDoc.insertPage,
    save: mockDoc.save
  })

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-middle': { startPage: 3, endPage: 6 }
  }
  const pdfConfig = { filename: 'test', outputDir: 'out' }

  await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  // Should remove pages 9, 8, 7 (after endPage=6) and pages 2, 1, 0 (before startPage=3)
  t.true(removePage.called)
})

// ─────────────────────────────────────────────────────────────────────────────
// Cover page tests
// ─────────────────────────────────────────────────────────────────────────────

test('splitPdf inserts cover page when coverPage is specified', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)
  const mockCoversDoc = createMockPdfDoc(sandbox, 5)
  const insertPage = sandbox.stub()
  const copyPages = sandbox.stub().resolves([{ id: 'cover-page' }])

  mockDoc.copy.resolves({
    getPageCount: () => 10,
    removePage: sandbox.stub(),
    copyPages,
    insertPage,
    save: mockDoc.save
  })

  const loadStub = sandbox.stub()
  loadStub.onCall(0).resolves(mockDoc)
  loadStub.onCall(1).resolves(mockCoversDoc)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: loadStub } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-chapter1': { startPage: 0, endPage: 5, coverPage: 2 }
  }
  const pdfConfig = { filename: 'book', outputDir: 'out' }

  await splitPdf(Buffer.from([]), Buffer.from([]), pageMap, pdfConfig)

  // Should copy cover page from covers doc
  t.true(copyPages.calledWith(mockCoversDoc, [2]))
  // Should insert at position 0
  t.true(insertPage.calledWith(0, sinon.match.object))
})

test('splitPdf does not insert cover page when coverPage is undefined', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)
  const mockCoversDoc = createMockPdfDoc(sandbox, 5)
  const insertPage = sandbox.stub()

  mockDoc.copy.resolves({
    getPageCount: () => 10,
    removePage: sandbox.stub(),
    copyPages: sandbox.stub().resolves([{}]),
    insertPage,
    save: mockDoc.save
  })

  const loadStub = sandbox.stub()
  loadStub.onCall(0).resolves(mockDoc)
  loadStub.onCall(1).resolves(mockCoversDoc)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: loadStub } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-chapter1': { startPage: 0, endPage: 5 } // No coverPage
  }
  const pdfConfig = { filename: 'book', outputDir: 'out' }

  await splitPdf(Buffer.from([]), Buffer.from([]), pageMap, pdfConfig)

  t.false(insertPage.called)
})

test('splitPdf does not insert cover page when coverPage is negative', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)
  const insertPage = sandbox.stub()

  mockDoc.copy.resolves({
    getPageCount: () => 10,
    removePage: sandbox.stub(),
    copyPages: sandbox.stub().resolves([{}]),
    insertPage,
    save: mockDoc.save
  })

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-chapter1': { startPage: 0, endPage: 5, coverPage: -1 }
  }
  const pdfConfig = { filename: 'book', outputDir: 'out' }

  await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  t.false(insertPage.called)
})

test('splitPdf does not insert cover page when coversFile is undefined', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)
  const insertPage = sandbox.stub()

  mockDoc.copy.resolves({
    getPageCount: () => 10,
    removePage: sandbox.stub(),
    copyPages: sandbox.stub().resolves([{}]),
    insertPage,
    save: mockDoc.save
  })

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-chapter1': { startPage: 0, endPage: 5, coverPage: 2 }
  }
  const pdfConfig = { filename: 'book', outputDir: 'out' }

  // coversFile is undefined
  await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  t.false(insertPage.called)
})

// ─────────────────────────────────────────────────────────────────────────────
// Error handling tests
// ─────────────────────────────────────────────────────────────────────────────

test('splitPdf throws PdfGenerationError when main PDF fails to load', async (t) => {
  const { sandbox } = t.context

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': {
      PDFDocument: {
        load: sandbox.stub().rejects(new Error('Invalid PDF structure'))
      }
    },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pdfConfig = { filename: 'book', outputDir: 'out' }

  const error = await t.throwsAsync(() =>
    splitPdf(Buffer.from([]), undefined, { 'page-1': { startPage: 0, endPage: 1 } }, pdfConfig)
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('load main PDF'))
  t.true(error.message.includes('Invalid PDF structure'))
})

test('splitPdf throws PdfGenerationError when covers PDF fails to load', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)

  const loadStub = sandbox.stub()
  loadStub.onCall(0).resolves(mockDoc)
  loadStub.onCall(1).rejects(new Error('Corrupted covers file'))

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: loadStub } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pdfConfig = { filename: 'book', outputDir: 'out' }

  const error = await t.throwsAsync(() =>
    splitPdf(Buffer.from([]), Buffer.from([]), { 'page-1': { startPage: 0, endPage: 1 } }, pdfConfig)
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes('load covers PDF'))
})

test('splitPdf throws PdfGenerationError when section extraction fails', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)

  mockDoc.copy.rejects(new Error('Copy operation failed'))

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-chapter1': { startPage: 0, endPage: 5 }
  }
  const pdfConfig = { filename: 'book', outputDir: 'out' }

  const error = await t.throwsAsync(() =>
    splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)
  )

  t.is(error.code, 'PDF_FAILED')
  t.true(error.message.includes("extract section 'page-chapter1'"))
})

// ─────────────────────────────────────────────────────────────────────────────
// Output path tests
// ─────────────────────────────────────────────────────────────────────────────

test('splitPdf uses outputDir from paths.getOutputDir()', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '/custom/output' } }
  })

  const pageMap = {
    'page-intro': { startPage: 0, endPage: 2 }
  }
  const pdfConfig = { filename: 'doc', outputDir: 'pdfs' }

  const result = await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  const filePath = Object.keys(result)[0]
  t.true(filePath.startsWith('/custom/output'))
})

test('splitPdf combines outputDir with pdfConfig.outputDir', async (t) => {
  const { sandbox } = t.context
  const mockDoc = createMockPdfDoc(sandbox, 10)

  const { splitPdf } = await esmock('./split.js', {
    'pdf-lib': { PDFDocument: { load: sandbox.stub().resolves(mockDoc) } },
    '#lib/11ty/index.js': { paths: { getOutputDir: () => '_site' } }
  })

  const pageMap = {
    'page-intro': { startPage: 0, endPage: 2 }
  }
  const pdfConfig = { filename: 'mybook', outputDir: '_downloads/pdf' }

  const result = await splitPdf(Buffer.from([]), undefined, pageMap, pdfConfig)

  const filePath = Object.keys(result)[0]
  t.true(filePath.includes('_site'))
  t.true(filePath.includes('_downloads/pdf'))
  t.true(filePath.includes('mybook-intro.pdf'))
})
