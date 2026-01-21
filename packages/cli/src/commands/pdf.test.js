import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()

  // Create mock reporter
  t.context.mockReporter = {
    configure: t.context.sandbox.stub().returnsThis(),
    start: t.context.sandbox.stub().returnsThis(),
    update: t.context.sandbox.stub().returnsThis(),
    succeed: t.context.sandbox.stub().returnsThis(),
    fail: t.context.sandbox.stub().returnsThis(),
    stop: t.context.sandbox.stub().returnsThis(),
  }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('pdf command should call generatePdf with pagedjs engine', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'pagedjs' }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.is(mockGeneratePdf.firstCall.args[0].lib, 'pagedjs', 'should pass lib to generatePdf')
  t.true(mockReporter.start.called, 'reporter.start should be called')
  t.true(mockReporter.succeed.called, 'reporter.succeed should be called')
})

test('pdf command should call generatePdf with prince engine', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'prince' }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.is(mockGeneratePdf.firstCall.args[0].lib, 'prince', 'should pass lib to generatePdf')
})

test('pdf command should open PDF when --open flag is provided', async (t) => {
  const { sandbox, mockReporter } = t.context

  const outputPath = '/project/_site/_pdf/test-book.pdf'
  const mockGeneratePdf = sandbox.stub().resolves(outputPath)
  const mockOpen = sandbox.stub()

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: mockOpen
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'pagedjs', open: true }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.true(mockOpen.called, 'open should be called when --open flag is provided')
  t.is(mockOpen.firstCall.args[0], outputPath, 'should open the generated PDF path')
})

test('pdf command should not open PDF when --open flag is not provided', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')
  const mockOpen = sandbox.stub()

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: mockOpen
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'pagedjs' }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.false(mockOpen.called, 'open should not be called without --open flag')
})

test('pdf command should pass debug option to generatePdf', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'pagedjs', debug: true }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.is(mockGeneratePdf.firstCall.args[0].lib, 'pagedjs', 'should pass lib to generatePdf')
  t.true(mockGeneratePdf.firstCall.args[0].debug, 'should pass debug option')
})

test('pdf command should throw error when build output is missing', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => false
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  const error = await t.throwsAsync(() => command.action({ engine: 'pagedjs' }, command))

  t.is(error.code, 'ENOBUILD', 'should throw ENOBUILD error')
  t.regex(error.message, /quire build/, 'error should mention quire build')
  t.false(mockGeneratePdf.called, 'generatePdf should not be called when build output is missing')
})

test('pdf command should run build first when --build flag is set and output missing', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')
  const mockBuild = sandbox.stub().resolves()
  let buildCalled = false

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => {
        // Return false first (before build), true after build
        if (!buildCalled) return false
        return true
      }
    },
    '#lib/11ty/index.js': {
      default: {
        build: async (opts) => {
          buildCalled = true
          return mockBuild(opts)
        }
      }
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'pagedjs', build: true }, command)

  t.true(mockBuild.called, 'build should be called when --build flag is set')
  t.true(mockGeneratePdf.called, 'generatePdf should be called after build')
})

test('pdf command should support deprecated --lib option', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  // Use deprecated --lib option (should still work)
  await command.action({ lib: 'prince' }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called with deprecated --lib')
  t.is(mockGeneratePdf.firstCall.args[0].lib, 'prince', 'should pass lib to generatePdf from deprecated option')
})

test('pdf command should call reporter.fail when generation fails', async (t) => {
  const { sandbox, mockReporter } = t.context

  const pdfError = new Error('PDF generation failed')
  const mockGeneratePdf = sandbox.stub().rejects(pdfError)

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await t.throwsAsync(() => command.action({ engine: 'pagedjs' }, command), { message: 'PDF generation failed' })

  t.true(mockReporter.start.called, 'reporter.start should be called')
  t.true(mockReporter.fail.called, 'reporter.fail should be called on error')
  t.false(mockReporter.succeed.called, 'reporter.succeed should not be called on error')
})

test('pdf command should configure reporter with quiet option', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGeneratePdf = sandbox.stub().resolves('/project/_site/_pdf/test-book.pdf')

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'pagedjs', quiet: true }, command)

  t.true(
    mockReporter.configure.calledWith(sinon.match({ quiet: true })),
    'reporter.configure should be called with quiet option'
  )
})

test('pdf command should pass output option to generatePdf', async (t) => {
  const { sandbox, mockReporter } = t.context

  const customOutput = '/custom/path/my-book.pdf'
  const mockGeneratePdf = sandbox.stub().resolves(customOutput)

  const PDFCommand = await esmock('./pdf.js', {
    '#lib/pdf/index.js': {
      default: mockGeneratePdf
    },
    '#lib/project/index.js': {
      hasSiteOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new PDFCommand()
  command.name = sandbox.stub().returns('pdf')

  await command.action({ engine: 'pagedjs', output: customOutput }, command)

  t.true(mockGeneratePdf.called, 'generatePdf should be called')
  t.is(mockGeneratePdf.firstCall.args[0].output, customOutput, 'should pass output option to generatePdf')
})
