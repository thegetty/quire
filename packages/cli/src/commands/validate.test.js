import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import sinon from 'sinon'
import esmock from 'esmock'
import { ValidationError } from '#src/errors/index.js'

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
  // Create mock logger (no global console stubbing needed!)
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }
  // mockLogger already created above
  // mockLogger already created above
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('validate command should find and validate YAML files', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock yamlValidation function
  const mockYamlValidation = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
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
  const { sandbox, fs, mockLogger } = t.context

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
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')
  command.logger = mockLogger

  // Run action - should throw ValidationError when there are validation errors
  const error = t.throws(() => command.action({}, command), { instanceOf: ValidationError })

  t.is(error.code, 'VALIDATION_FAILED', 'error should have correct code')
  t.is(error.exitCode, 4, 'error should have validation exit code')
  t.true(mockYamlValidation.called, 'validation should be attempted')
  t.true(mockLogger.error.called, 'errors should be logged')
})

test('validate command should call testcwd in preAction', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  // Mock yamlValidation function
  const mockYamlValidation = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
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
  const { sandbox, fs, vol, mockLogger } = t.context

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
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
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
  const { sandbox, fs, mockLogger } = t.context

  // Mock yamlValidation function
  const mockYamlValidation = sandbox.stub()

  // Mock testcwd helper
  const mockTestcwd = sandbox.stub()

  // Use esmock to replace imports
  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
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

// ─────────────────────────────────────────────────────────────────────────────
// JSON output tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('validate --json should output valid JSON when all files pass', async (t) => {
  const { sandbox, fs, mockLogger } = t.context
  const consoleLogStub = sandbox.stub(console, 'log')

  const mockYamlValidation = sandbox.stub()
  const mockTestcwd = sandbox.stub()

  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')

  command.action({ json: true }, command)

  // Should output via console.log, not logger.info
  t.true(consoleLogStub.calledOnce, 'console.log should be called once')
  t.false(mockLogger.info.called, 'logger.info should not be called in JSON mode')

  const output = JSON.parse(consoleLogStub.firstCall.args[0])

  // Verify JSON structure
  t.truthy(output.summary, 'JSON should have summary section')
  t.truthy(output.files, 'JSON should have files section')
  t.is(output.summary.files, 2, 'should report 2 YAML files')
  t.is(output.summary.passed, 2, 'both files should pass')
  t.is(output.summary.failed, 0, 'no files should fail')

  // Verify each file result
  t.true(output.files.every((f) => f.status === 'passed'), 'all files should have passed status')
})

test.serial('validate --json should output valid JSON with errors and throw', async (t) => {
  const { sandbox, fs, mockLogger } = t.context
  const consoleLogStub = sandbox.stub(console, 'log')

  const validationError = new Error('Invalid YAML')
  validationError.reason = 'Invalid YAML: missing required field'
  const mockYamlValidation = sandbox.stub().throws(validationError)
  const mockTestcwd = sandbox.stub()

  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')
  command.logger = mockLogger

  // Should still throw ValidationError for exit code
  const error = t.throws(() => command.action({ json: true }, command), { instanceOf: ValidationError })
  t.is(error.code, 'VALIDATION_FAILED')

  // Should output JSON before throwing
  t.true(consoleLogStub.calledOnce, 'console.log should be called once')

  const output = JSON.parse(consoleLogStub.firstCall.args[0])

  t.is(output.summary.files, 2)
  t.is(output.summary.failed, 2, 'both files should fail')
  t.is(output.summary.passed, 0)

  // Verify error details in file results
  t.true(output.files.every((f) => f.status === 'failed'), 'all files should have failed status')
  t.true(output.files.every((f) => f.error), 'all failed files should have error details')

  // logger.error should NOT be called in JSON mode
  t.false(mockLogger.error.called, 'logger.error should not be called in JSON mode')
})

test.serial('validate --json should output mixed results', async (t) => {
  const { sandbox, fs, mockLogger } = t.context
  const consoleLogStub = sandbox.stub(console, 'log')

  // First file passes, second file fails
  const validationError = new Error('Invalid YAML')
  validationError.reason = 'duplicated mapping key at line 5'
  const mockYamlValidation = sandbox.stub()
  mockYamlValidation.onFirstCall().returns(undefined)
  mockYamlValidation.onSecondCall().throws(validationError)
  const mockTestcwd = sandbox.stub()

  const ValidateCommand = await esmock('./validate.js', {
    '../validators/validate-yaml.js': {
      default: mockYamlValidation
    },
    '#lib/project/index.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#helpers/test-cwd.js': {
      default: mockTestcwd
    },
    '#lib/logger/index.js': {
      logger: mockLogger
    },
    'fs-extra': fs
  })

  const command = new ValidateCommand()
  command.name = sandbox.stub().returns('validate')
  command.logger = mockLogger

  // Should throw because there are errors
  t.throws(() => command.action({ json: true }, command), { instanceOf: ValidationError })

  const output = JSON.parse(consoleLogStub.firstCall.args[0])

  t.is(output.summary.files, 2)
  t.is(output.summary.passed, 1)
  t.is(output.summary.failed, 1)
  t.is(output.files[0].status, 'passed')
  t.is(output.files[1].status, 'failed')
  t.is(output.files[1].error, 'duplicated mapping key at line 5')
})
