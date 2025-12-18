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

  // Setup mock directory structure with build artifacts
  t.context.vol.fromJSON({
    '/project/_site/index.html': '<html>Quire Test </html>',
    '/project/_site/styles.css': 'body { }',
    '/project/content/index.md': '# Content',
    '/project/package.json': JSON.stringify({ name: 'test-project' })
  })

  t.context.projectRoot = '/project'

  // Stub console methods to suppress output during tests
  if (!console.debug.restore) {
    t.context.consoleDebugStub = t.context.sandbox.stub(console, 'debug')
  } else {
    t.context.consoleDebugStub = console.debug
    t.context.consoleDebugStub.resetHistory()
  }
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('clean command should call clean helper with correct parameters', async (t) => {
  const { sandbox, fs } = t.context

  // Mock clean helper
  const mockClean = sandbox.stub().resolves(['/project/_site'])

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const CleanCommand = await esmock('./clean.js', {
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#lib/11ty/index.js': {
      paths: { output: '_site' },
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new CleanCommand()
  command.name = sandbox.stub().returns('clean')

  // Run action
  const options = {}
  await command.action(options, command)

  t.true(mockClean.called, 'clean should be called')
  t.true(mockClean.calledWith('/project', { output: '_site' }, options), 'clean should be called with correct parameters')
})

test('clean command should handle dry-run option', async (t) => {
  const { sandbox, fs } = t.context

  // Mock clean helper to return paths that would be deleted
  const mockClean = sandbox.stub().resolves(['/project/_site/index.html', '/project/_site/styles.css'])

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const CleanCommand = await esmock('./clean.js', {
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#lib/11ty/index.js': {
      paths: { output: '_site' },
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new CleanCommand()
  command.name = sandbox.stub().returns('clean')

  // Run action with dry-run
  const options = { dryRun: true }
  await command.action(options, command)

  t.true(mockClean.called, 'clean should be called')
  t.true(mockClean.calledWith('/project', { output: '_site' }, options), 'clean should receive dry-run option')
})

test('clean command should call testcwd in preAction', async (t) => {
  const { sandbox, fs } = t.context

  // Mock clean helper
  const mockClean = sandbox.stub().resolves([])

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const CleanCommand = await esmock('./clean.js', {
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#lib/11ty/index.js': {
      paths: { output: '_site' },
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new CleanCommand()
  command.name = sandbox.stub().returns('clean')

  // Run preAction
  command.preAction(command)

  t.true(mockTestcwd.called, 'testcwd should be called in preAction')
  t.true(mockTestcwd.calledWith(command), 'testcwd should be called with command object')
})

test('clean command should handle empty deletedPaths', async (t) => {
  const { sandbox, fs } = t.context

  // Mock clean helper to return empty array (no files to delete)
  const mockClean = sandbox.stub().resolves([])

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const CleanCommand = await esmock('./clean.js', {
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#lib/11ty/index.js': {
      paths: { output: '_site' },
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new CleanCommand()
  command.name = sandbox.stub().returns('clean')

  // Run action
  const options = {}
  await command.action(options, command)

  t.true(mockClean.called, 'clean should be called')
  // Should complete without error even when no files are deleted
  t.pass()
})

test('clean command should pass all options to clean helper', async (t) => {
  const { sandbox, fs } = t.context

  // Mock clean helper
  const mockClean = sandbox.stub().resolves(['/project/_site'])

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const CleanCommand = await esmock('./clean.js', {
    '#helpers/clean.js': {
      clean: mockClean
    },
    '#lib/11ty/index.js': {
      paths: { output: '_site' },
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new CleanCommand()
  command.name = sandbox.stub().returns('clean')

  // Run action with multiple options
  const options = { verbose: true, progress: true, dryRun: false }
  await command.action(options, command)

  t.true(mockClean.calledWith('/project', { output: '_site' }, options), 'clean should receive all options')
})
