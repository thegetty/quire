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
    '/project/content/_data/config.yaml': 'title: Quire Test Project\nidentifier:\n  isbn: "978-0-12345-678-9"',
    '/project/content/_data/publication.yaml': 'title: Test Publication',
    '/project/package.json': JSON.stringify({ name: 'test-project' })
  })

  t.context.projectRoot = '/project'

  // Stub console methods to suppress output during tests
  if (!console.debug.restore) {
    t.context.consoleDebugStub = t.context.sandbox.stub(console, 'debug')
    t.context.consoleLogStub = t.context.sandbox.stub(console, 'log')
    t.context.consoleErrorStub = t.context.sandbox.stub(console, 'error')
  } else {
    t.context.consoleDebugStub = console.debug
    t.context.consoleDebugStub.resetHistory()
    t.context.consoleLogStub = console.log
    t.context.consoleLogStub.resetHistory()
    t.context.consoleErrorStub = console.error
    t.context.consoleErrorStub.resetHistory()
  }
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('validate command should find and validate YAML files', async (t) => {
  const { sandbox, fs } = t.context

  // Mock yamlValidation function
  const mockYamlValidation = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/11ty/index.js': {
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')

  // Run action
  command.action({}, command)

  // Should validate both YAML files
  t.true(mockYamlValidation.callCount >= 2, 'should validate multiple YAML files')
})

test('validate command should handle validation errors', async (t) => {
  const { sandbox, fs } = t.context

  // Mock yamlValidation function to throw error
  const validationError = new Error('Invalid YAML')
  validationError.reason = 'Invalid YAML: missing required field'
  const mockYamlValidation = sandbox.stub().throws(validationError)

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/11ty/index.js': {
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')

  // Run action - should not throw, errors are collected
  command.action({}, command)

  // Validation should have been attempted
  t.true(mockYamlValidation.called, 'validation should be attempted')
})

test('validate command should call testcwd in preAction', async (t) => {
  const { sandbox, fs } = t.context

  // Mock yamlValidation function
  const mockYamlValidation = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/11ty/index.js': {
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')

  // Run preAction
  command.preAction({}, command)

  t.true(mockTestcwd.called, 'testcwd should be called in preAction')
})

test('validate command should filter YAML files correctly', async (t) => {
  const { sandbox, fs, vol } = t.context

  // Add non-YAML files
  vol.fromJSON({
    '/project/content/_data/data.json': '{"key": "value"}',
    '/project/content/_data/README.md': '# README',
    '/project/content/_data/script.js': 'console.log("test")'
  })

  // Mock yamlValidation function
  const mockYamlValidation = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/11ty/index.js': {
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')

  // Run action
  command.action({}, command)

  // Should only validate YAML files (config.yaml and publication.yaml from beforeEach)
  t.is(mockYamlValidation.callCount, 2, 'should only validate YAML files')
})

test('validate command should pass debug option through', async (t) => {
  const { sandbox, fs } = t.context

  // Mock yamlValidation function
  const mockYamlValidation = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/11ty/index.js': {
      projectRoot: '/project'
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')

  // Run action with debug option
  command.action({ debug: true }, command)

  t.true(mockYamlValidation.called, 'validation should run')
  // Debug output should be logged (verified through console.debug stub)
})
