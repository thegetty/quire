import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  // Create sinon sandbox for mocking
  t.context.sandbox = sinon.createSandbox()

  // Create in-memory file system
  t.context.vol = new Volume()
  t.context.fs = createFsFromVolume(t.context.vol)

  // Setup mock directory structure
  t.context.vol.fromJSON({
    '/project/_site/epub/content.opf': '<?xml version="1.0"?><package></package>',
    '/project/_site/epub/toc.ncx': '<?xml version="1.0"?><ncx></ncx>',
    '/project/package.json': JSON.stringify({ name: 'test-project' })
  })

  t.context.projectRoot = '/project'

  // Stub console methods to suppress output during tests
  // Create mock logger (no global console stubbing needed!)
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }
  // mockLogger already created above
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('epub command should generate EPUB using epubjs engine', async (t) => {
  const { sandbox, fs } = t.context

  // Mock the epub generator
  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    // Simulate EPUB generation by creating output file
    fs.writeFileSync(output, Buffer.from('EPUB_BINARY_DATA'))
  })

  // Mock the epub library module
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with epubjs engine
  await command.action({ engine: 'epubjs' }, command)

  t.true(mockLibEpub.called, 'libEpub should be called')
  t.true(mockLibEpub.calledWith('epubjs'), 'should use epubjs engine')
  t.true(mockEpubGenerator.called, 'EPUB generator should be called')
})

test('epub command should generate EPUB using pandoc engine', async (t) => {
  const { sandbox, fs } = t.context

  // Mock the epub generator
  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    // Simulate EPUB generation by creating output file
    fs.writeFileSync(output, Buffer.from('PANDOC_EPUB_DATA'))
  })

  // Mock the epub library module
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with pandoc engine
  await command.action({ engine: 'pandoc' }, command)

  t.true(mockLibEpub.called, 'libEpub should be called')
  t.true(mockLibEpub.calledWith('pandoc'), 'should use pandoc engine')
  t.true(mockEpubGenerator.called, 'EPUB generator should be called')
})

test('epub command should open EPUB when --open flag is provided', async (t) => {
  const { sandbox, fs } = t.context

  // Mock the epub generator
  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  // Mock the epub library module
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  // Mock open function
  const mockOpen = sandbox.stub().resolves()

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    'fs-extra': fs,
    open: {
      default: mockOpen
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with open flag
  await command.action({ engine: 'epubjs', open: true }, command)

  t.true(mockEpubGenerator.called, 'EPUB should be generated')
  t.true(mockOpen.called, 'open should be called when --open flag is provided')
})

test('epub command should pass debug option to library', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock the epub generator
  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  // Mock the epub library module
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    '#lib/logger/index.js': {
      createLogger: () => mockLogger
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with debug option
  await command.action({ engine: 'epubjs', debug: true }, command)

  // Verify debug option was passed to library
  const libEpubCall = mockLibEpub.getCall(0)
  t.true(libEpubCall.args[1].debug === true, 'debug option should be passed to library')
})

test('epub command should throw error when build output is missing', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock the epub library module
  const mockEpubGenerator = sandbox.stub()
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => false
    },
    '#lib/logger/index.js': {
      createLogger: () => mockLogger
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action - should throw error when output doesn't exist
  const error = await t.throwsAsync(() => command.action({ engine: 'epubjs' }, command))

  t.is(error.code, 'BUILD_OUTPUT_MISSING', 'should throw BUILD_OUTPUT_MISSING error')
  t.regex(error.message, /build output not found/, 'error should mention build output not found')
  t.false(mockEpubGenerator.called, 'EPUB generator should not be called when input is missing')
})

test('epub command should use correct output path', async (t) => {
  const { sandbox, fs } = t.context

  // Mock the epub generator
  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  // Mock the epub library module
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action
  await command.action({ engine: 'epubjs' }, command)

  // Verify output path includes engine name
  const generatorCall = mockEpubGenerator.getCall(0)
  t.true(generatorCall.args[1].includes('epubjs.epub'), 'output path should include engine name')
})

test('epub command should run build first when --build flag is set and output missing', async (t) => {
  const { sandbox, fs } = t.context

  // Mock the epub generator
  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  // Mock the epub library module
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)
  const mockBuild = sandbox.stub().resolves()
  let buildCalled = false

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
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
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with --build flag
  await command.action({ engine: 'epubjs', build: true }, command)

  t.true(mockBuild.called, 'build should be called when --build flag is set')
  t.true(mockEpubGenerator.called, 'EPUB generator should be called after build')
})

test('epub command should support deprecated --lib option', async (t) => {
  const { sandbox, fs } = t.context

  // Mock the epub generator
  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  // Mock the epub library module
  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  // Use esmock to replace imports
  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Use deprecated --lib option (should still work)
  await command.action({ lib: 'pandoc' }, command)

  t.true(mockLibEpub.called, 'libEpub should be called with deprecated --lib')
  t.true(mockLibEpub.calledWith('pandoc'), 'should use pandoc from deprecated option')
})

test('epub command should use epubEngine from config when --engine not specified', async (t) => {
  const { sandbox, fs } = t.context

  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')
  // Mock config to return 'pandoc' for epubEngine
  command.config = { get: (key) => key === 'epubEngine' ? 'pandoc' : undefined }

  // No --engine specified, should use config value
  await command.action({}, command)

  t.true(mockLibEpub.called, 'libEpub should be called')
  t.true(mockLibEpub.calledWith('pandoc'), 'should use epubEngine from config')
})

test('epub command should use default engine when --engine not specified and config not set', async (t) => {
  const { sandbox, fs } = t.context

  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')
  // Mock config to return undefined (no epubEngine set)
  command.config = { get: () => undefined }

  // No --engine specified, no config, should use default 'epubjs'
  await command.action({}, command)

  t.true(mockLibEpub.called, 'libEpub should be called')
  t.true(mockLibEpub.calledWith('epubjs'), 'should use default epubjs when no config')
})

test('epub command --engine flag should override config epubEngine', async (t) => {
  const { sandbox, fs, mockReporter } = t.context

  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')
  // Mock config to return 'pandoc' for epubEngine
  command.config = { get: (key) => key === 'epubEngine' ? 'pandoc' : undefined }

  // --engine epubjs should override config's 'pandoc'
  await command.action({ engine: 'epubjs' }, command)

  t.true(mockLibEpub.called, 'libEpub should be called')
  t.true(mockLibEpub.calledWith('epubjs'), 'CLI --engine should override config')
})

test('epub command should configure reporter with quiet option', async (t) => {
  const { sandbox, fs, mockReporter } = t.context

  const mockEpubGenerator = sandbox.stub().callsFake(async (input, output) => {
    fs.writeFileSync(output, Buffer.from('EPUB_DATA'))
  })

  const mockLibEpub = sandbox.stub().resolves(mockEpubGenerator)

  const EPUBCommand = await esmock('./epub.js', {
    '#lib/epub/index.js': {
      default: mockLibEpub
    },
    '#lib/project/index.js': {
      default: {
        getProjectRoot: () => '/project',
        getEpubDir: () => '_site/epub'
      },
      hasEpubOutput: () => true
    },
    '#lib/reporter/index.js': {
      default: mockReporter
    },
    'fs-extra': fs,
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
