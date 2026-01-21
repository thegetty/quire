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

test('epub command should call generateEpub with epubjs engine', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/epubjs.epub')

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'epubjs' }, command)

  t.true(mockGenerateEpub.called, 'generateEpub should be called')
  t.is(mockGenerateEpub.firstCall.args[0].lib, 'epubjs', 'should pass lib to generateEpub')
  // Nota bene: reporter.start/succeed are called by façade (lib/epub/index.js), not the command
})

test('epub command should call generateEpub with pandoc engine', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/pandoc.epub')

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'pandoc' }, command)

  t.true(mockGenerateEpub.called, 'generateEpub should be called')
  t.is(mockGenerateEpub.firstCall.args[0].lib, 'pandoc', 'should pass lib to generateEpub')
})

test('epub command should open EPUB when --open flag is provided', async (t) => {
  const { sandbox, mockReporter } = t.context

  const outputPath = '/project/epubjs.epub'
  const mockGenerateEpub = sandbox.stub().resolves(outputPath)
  const mockOpen = sandbox.stub()

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: mockOpen
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'epubjs', open: true }, command)

  t.true(mockGenerateEpub.called, 'generateEpub should be called')
  t.true(mockOpen.called, 'open should be called when --open flag is provided')
  t.is(mockOpen.firstCall.args[0], outputPath, 'should open the generated EPUB path')
})

test('epub command should not open EPUB when --open flag is not provided', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/epubjs.epub')
  const mockOpen = sandbox.stub()

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: mockOpen
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'epubjs' }, command)

  t.true(mockGenerateEpub.called, 'generateEpub should be called')
  t.false(mockOpen.called, 'open should not be called without --open flag')
})

test('epub command should pass debug option to generateEpub', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/epubjs.epub')

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'epubjs', debug: true }, command)

  t.true(mockGenerateEpub.called, 'generateEpub should be called')
  t.is(mockGenerateEpub.firstCall.args[0].lib, 'epubjs', 'should pass lib to generateEpub')
  t.true(mockGenerateEpub.firstCall.args[0].debug, 'should pass debug option')
})

test('epub command should throw MissingBuildOutputError when build output is missing', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/epubjs.epub')

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      default: { getEpubDir: () => '_epub' },
      hasEpubOutput: () => false
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  const error = await t.throwsAsync(() => command.action({ engine: 'epubjs' }, command))

  t.is(error.code, 'BUILD_OUTPUT_MISSING', 'should throw BUILD_OUTPUT_MISSING error')
  t.regex(error.message, /EPUB/, 'error should mention EPUB')
  t.false(mockGenerateEpub.called, 'generateEpub should not be called when build output is missing')
})

test('epub command should run build first when --build flag is set and output missing', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/epubjs.epub')
  const mockBuild = sandbox.stub().resolves()
  let buildCalled = false

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => {
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
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'epubjs', build: true }, command)

  t.true(mockBuild.called, 'build should be called when --build flag is set')
  t.true(mockGenerateEpub.called, 'generateEpub should be called after build')
})

test('epub command should support deprecated --lib option', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/pandoc.epub')

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Use deprecated --lib option (should still work)
  await command.action({ lib: 'pandoc' }, command)

  t.true(mockGenerateEpub.called, 'generateEpub should be called with deprecated --lib')
  t.is(mockGenerateEpub.firstCall.args[0].lib, 'pandoc', 'should pass lib to generateEpub from deprecated option')
})

test('epub command should propagate errors from generateEpub', async (t) => {
  const { sandbox, mockReporter } = t.context

  const epubError = new Error('EPUB generation failed')
  const mockGenerateEpub = sandbox.stub().rejects(epubError)

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Error is propagated; reporter lifecycle is handled by façade (lib/epub/index.js)
  await t.throwsAsync(() => command.action({ engine: 'epubjs' }, command), { message: 'EPUB generation failed' })
})

test('epub command should configure reporter with quiet option', async (t) => {
  const { sandbox, mockReporter } = t.context

  const mockGenerateEpub = sandbox.stub().resolves('/project/epubjs.epub')

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'epubjs', quiet: true }, command)

  t.true(
    mockReporter.configure.calledWith(sinon.match({ quiet: true })),
    'reporter.configure should be called with quiet option'
  )
})

test('epub command should pass output option to generateEpub', async (t) => {
  const { sandbox, mockReporter } = t.context

  const customOutput = '/custom/path/my-book.epub'
  const mockGenerateEpub = sandbox.stub().resolves(customOutput)

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockGenerateEpub
    },
    '#lib/project/index.js': {
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': {
      existsSync: () => true
    },
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  await command.action({ engine: 'epubjs', output: customOutput }, command)

  t.true(mockGenerateEpub.called, 'generateEpub should be called')
  t.is(mockGenerateEpub.firstCall.args[0].output, customOutput, 'should pass output option to generateEpub')
})
