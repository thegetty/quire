import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('pdf command should call generatePdf with pagedjs library', async (t) => {
  const { sandbox } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ lib: 'pagedjs' }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.deepEqual(mockGeneratePdf.firstCall.args[0], { lib: 'pagedjs' }, 'should pass options to generatePdf')
})

test('pdf command should call generatePdf with prince library', async (t) => {
  const { sandbox } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ lib: 'prince' }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.deepEqual(mockGeneratePdf.firstCall.args[0], { lib: 'prince' }, 'should pass options to generatePdf')
})

test('pdf command should open PDF when --open flag is provided', async (t) => {
  const { sandbox } = t.context

  const outputPath = '/project/_site/_pdf/test-book.pdf'
  const mockGeneratePdf = sandbox.stub().resolves(outputPath)
  const mockOpen = sandbox.stub()

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    open: {
      default: mockOpen
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ lib: 'pagedjs', open: true }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.true(mockOpen.called, 'open should be called when --open flag is provided')
  t.is(mockOpen.firstCall.args[0], outputPath, 'should open the generated PDF path')
})

test('pdf command should not open PDF when --open flag is not provided', async (t) => {
  const { sandbox } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')
  const mockOpen = sandbox.stub()

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    open: {
      default: mockOpen
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ lib: 'pagedjs' }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.false(mockOpen.called, 'open should not be called without --open flag')
})

test('pdf command should pass debug option to generatePdf', async (t) => {
  const { sandbox } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ lib: 'pagedjs', debug: true }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.deepEqual(mockGeneratePdf.firstCall.args[0], { lib: 'pagedjs', debug: true }, 'should pass debug option')
})
