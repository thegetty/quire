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

test('epub command should generate EPUB using epubjs library', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

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
      }
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with epubjs
  await command.action({ lib: 'epubjs' }, command)

  t.true(mockLibEpub.called, 'libEpub should be called')
  t.true(mockLibEpub.calledWith('epubjs'), 'should use epubjs library')
  t.true(mockEpubGenerator.called, 'EPUB generator should be called')
})

test('epub command should generate EPUB using pandoc library', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

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
      }
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with pandoc
  await command.action({ lib: 'pandoc' }, command)

  t.true(mockLibEpub.called, 'libEpub should be called')
  t.true(mockLibEpub.calledWith('pandoc'), 'should use pandoc library')
  t.true(mockEpubGenerator.called, 'EPUB generator should be called')
})

test('epub command should open EPUB when --open flag is provided', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

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
      }
    },
    'fs-extra': fs,
    open: {
      default: mockOpen
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with open flag
  await command.action({ lib: 'epubjs', open: true }, command)

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
      }
    },
    '#src/lib/logger.js': {
      default: mockLogger
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action with debug option
  await command.action({ lib: 'epubjs', debug: true }, command)

  // Verify debug option was passed to library
  const libEpubCall = mockLibEpub.getCall(0)
  t.true(libEpubCall.args[1].debug === true, 'debug option should be passed to library')
})

test('epub command should handle missing build output gracefully', async (t) => {
  const { sandbox, fs, vol, mockLogger } = t.context

  // Remove the built EPUB input by resetting and setting up minimal structure
  vol.reset()
  vol.fromJSON({
    '/project/package.json': '{"name":"test-project"}'
    // No _site/epub directory
  })

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
      }
    },
    '#src/lib/logger.js': {
      default: mockLogger
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action - should return early when input doesn't exist
  await command.action({ lib: 'epubjs' }, command)

  t.false(mockEpubGenerator.called, 'EPUB generator should not be called when input is missing')
})

test('epub command should use correct output path', async (t) => {
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
      }
    },
    'fs-extra': fs,
    open: {
      default: sandbox.stub()
    }
  })

  const command = new EPUBCommand()
  command.name = sandbox.stub().returns('epub')

  // Run action
  await command.action({ lib: 'epubjs' }, command)

  // Verify output path includes library name
  const generatorCall = mockEpubGenerator.getCall(0)
  t.true(generatorCall.args[1].includes('epubjs.epub'), 'output path should include library name')
})
