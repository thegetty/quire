import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  // Create in-memory file system
  t.context.vol = new Volume()
  t.context.fs = createFsFromVolume(t.context.vol)
})

test.afterEach.always((t) => {
  // Restore all mocks if sandbox exists
  if (t.context.sandbox) {
    t.context.sandbox.restore()
  }

  // Clear in-memory file system
  t.context.vol.reset()
})

test.serial('testcwd should not error when called in a Quire project directory', async (t) => {
  const { fs, vol } = t.context

  // Create sandbox for this test
  const sandbox = sinon.createSandbox()
  t.context.sandbox = sandbox

  // Setup a Quire project directory with .eleventy.js
  vol.fromJSON({
    '/quire-project/.eleventy.js': 'module.exports = function() {}',
    '/quire-project/content/_data/config.yaml': 'title: Test Project',
    '/quire-project/package.json': JSON.stringify({ name: 'test-project' })
  })

  // Create stubs
  const consoleErrorStub = sandbox.stub(console, 'error')
  const processExitStub = sandbox.stub(process, 'exit')
  const cwdStub = sandbox.stub(process, 'cwd').returns('/quire-project')

  // Create mock process object with stubbed methods
  const mockProcess = {
    cwd: cwdStub,
    exit: processExitStub
  }

  // Mock detect module with memfs
  const mockDetect = await esmock('../lib/project/detect.js', {
    'node:fs': fs
  })

  // Mock node:fs and node:process to use memfs and stubbed process
  const testcwd = await esmock('./test-cwd.js', {
    'node:process': mockProcess,
    '#lib/project/index.js': {
      detect: mockDetect
    }
  })

  // Create mock command
  const mockCommand = {
    name: sandbox.stub().returns('build')
  }

  // Call testcwd - should not throw or exit
  testcwd(mockCommand)

  t.false(consoleErrorStub.called, 'console.error should not be called')
  t.false(processExitStub.called, 'process.exit should not be called')
})

test.serial('testcwd should error when called outside a Quire project directory', async (t) => {
  const { fs, vol } = t.context

  // Create sandbox for this test
  const sandbox = sinon.createSandbox()
  t.context.sandbox = sandbox

  // Setup a non-Quire directory (no .eleventy.js or other Quire marker files)
  vol.fromJSON({
    '/not-quire/some-file.txt': 'not a quire project',
    '/not-quire/package.json': JSON.stringify({ name: 'not-a-quire-project' })
  })

  // Create stubs
  const consoleErrorStub = sandbox.stub(console, 'error')
  const processExitStub = sandbox.stub(process, 'exit')
  const cwdStub = sandbox.stub(process, 'cwd').returns('/not-quire')

  // Create mock process object with stubbed methods
  const mockProcess = {
    cwd: cwdStub,
    exit: processExitStub
  }

  // Mock detect module with memfs
  const mockDetect = await esmock('../lib/project/detect.js', {
    'node:fs': fs
  })

  // Mock node:fs and node:process to use memfs and stubbed process
  const testcwd = await esmock('./test-cwd.js', {
    'node:process': mockProcess,
    '#lib/project/index.js': {
      detect: mockDetect
    }
  })

  // Create mock command
  const mockCommand = {
    name: sandbox.stub().returns('build')
  }

  // Call testcwd - should log error and exit
  testcwd(mockCommand)

  t.true(consoleErrorStub.called, 'console.error should be called')
  t.true(consoleErrorStub.calledWith(
    sinon.match(/build command must be run while in a Quire project directory/)
  ), 'error message should mention the command name')
  t.true(processExitStub.calledWith(1), 'process.exit should be called with exit code 1')
})

test.serial('testcwd should include command name in error message', async (t) => {
  const { fs, vol } = t.context

  // Create sandbox for this test
  const sandbox = sinon.createSandbox()
  t.context.sandbox = sandbox

  // Setup a non-Quire directory
  vol.fromJSON({
    '/non-quire-directory/file.txt': 'test'
  })

  // Create stubs
  const consoleErrorStub = sandbox.stub(console, 'error')
  const processExitStub = sandbox.stub(process, 'exit')
  const cwdStub = sandbox.stub(process, 'cwd').returns('/non-quire-directory')

  // Create mock process object with stubbed methods
  const mockProcess = {
    cwd: cwdStub,
    exit: processExitStub
  }

  // Mock detect module with memfs
  const mockDetect = await esmock('../lib/project/detect.js', {
    'node:fs': fs
  })

  // Mock node:fs and node:process to use memfs and stubbed process
  const testcwd = await esmock('./test-cwd.js', {
    'node:process': mockProcess,
    '#lib/project/index.js': {
      detect: mockDetect
    }
  })

  // Create mock command with specific name
  const mockCommand = {
    name: sandbox.stub().returns('clean')
  }

  // Call testcwd
  testcwd(mockCommand)

  t.true(consoleErrorStub.called, 'console.error should be called')

  const errorMessage = consoleErrorStub.getCall(0).args[0]
  t.true(errorMessage.includes('clean'), 'error message should include command name')
  t.true(errorMessage.includes('quire clean'), 'error message should include full command')
})

test.serial('testcwd should work when command is null', async (t) => {
  const { fs, vol } = t.context

  // Create sandbox for this test
  const sandbox = sinon.createSandbox()
  t.context.sandbox = sandbox

  // Setup a non-Quire directory
  vol.fromJSON({
    '/not-a-quire-directory/file.txt': 'test'
  })

  // Create stubs
  const consoleErrorStub = sandbox.stub(console, 'error')
  const processExitStub = sandbox.stub(process, 'exit')
  const cwdStub = sandbox.stub(process, 'cwd').returns('/not-a-quire-directory')

  // Create mock process object with stubbed methods
  const mockProcess = {
    cwd: cwdStub,
    exit: processExitStub
  }

  // Mock detect module with memfs
  const mockDetect = await esmock('../lib/project/detect.js', {
    'node:fs': fs
  })

  // Mock node:fs and node:process to use memfs and stubbed process
  const testcwd = await esmock('./test-cwd.js', {
    'node:process': mockProcess,
    '#lib/project/index.js': {
      detect: mockDetect
    }
  })

  // Call testcwd with null command
  testcwd(null)

  t.true(consoleErrorStub.called, 'console.error should be called')
  t.true(processExitStub.calledWith(1), 'process.exit should be called with exit code 1')
})
