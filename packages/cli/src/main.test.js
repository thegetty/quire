import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'
import QuireError from '#src/errors/quire-error.js'

/**
 * Main Program Integration Tests
 *
 * Tests the runtime behavior of the CLI program, including
 * error handling in command lifecycle hooks.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

/**
 * Helper to create a mock command with configurable hooks
 */
function createMockCommand(overrides = {}) {
  return {
    name: 'mock-command',
    description: 'Mock command for integration tests',
    summary: 'mocked command',
    action: async () => {},
    ...overrides
  }
}

test('preAction hook errors are passed to handleError', async (t) => {
  const { sandbox } = t.context

  const testError = new QuireError('Test preAction error', {
    code: 'TEST_ERROR',
    exitCode: 42
  })

  const mockHandleError = sandbox.stub()

  const mockCommand = createMockCommand({
    preAction: () => {
      throw testError
    }
  })

  // Use esmock to inject our mock command and handleError
  await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: mockHandleError
    }
  })

  // The program is created at import time, so we need to trigger the hook
  // by parsing a command. Import the mocked program.
  const { default: program } = await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: mockHandleError
    }
  })

  // Configure Commander to not exit on error during tests
  program.exitOverride()
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })

  // Parse the test command to trigger preAction
  try {
    await program.parseAsync(['node', 'quire', 'mock-command'])
  } catch {
    // Commander may throw after our error is handled
  }

  t.true(mockHandleError.called, 'handleError should be called for preAction errors')
  t.is(mockHandleError.firstCall.args[0], testError, 'handleError should receive the thrown error')
})

test('postAction hook errors are passed to handleError', async (t) => {
  const { sandbox } = t.context

  const testError = new QuireError('Test postAction error', {
    code: 'TEST_POST_ERROR',
    exitCode: 43
  })

  const mockHandleError = sandbox.stub()

  const mockCommand = createMockCommand({
    action: async () => {
      // Action succeeds
    },
    postAction: () => {
      throw testError
    }
  })

  const { default: program } = await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: mockHandleError
    }
  })

  program.exitOverride()
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })

  try {
    await program.parseAsync(['node', 'quire', 'mock-command'])
  } catch {
    // Commander may throw after our error is handled
  }

  t.true(mockHandleError.called, 'handleError should be called for postAction errors')
  t.is(mockHandleError.firstCall.args[0], testError, 'handleError should receive the thrown error')
})

test('action errors are passed to handleError', async (t) => {
  const { sandbox } = t.context

  const testError = new QuireError('Test action error', {
    code: 'TEST_ACTION_ERROR',
    exitCode: 44
  })

  const mockHandleError = sandbox.stub()

  const mockCommand = createMockCommand({
    action: async () => {
      throw testError
    }
  })

  const { default: program } = await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: mockHandleError
    }
  })

  program.exitOverride()
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })

  try {
    await program.parseAsync(['node', 'quire', 'mock-command'])
  } catch {
    // Commander may throw after our error is handled
  }

  t.true(mockHandleError.called, 'handleError should be called for action errors')
  t.is(mockHandleError.firstCall.args[0], testError, 'handleError should receive the thrown error')
})

test('preAction hook preserves this context for command methods', async (t) => {
  const { sandbox } = t.context

  const debugSpy = sandbox.spy()
  let thisContext = null

  const mockCommand = createMockCommand({
    debug: debugSpy,
    preAction: function () {
      thisContext = this
      this.debug('preAction called')
    }
  })

  const { default: program } = await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: sandbox.stub()
    }
  })

  program.exitOverride()
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })

  try {
    await program.parseAsync(['node', 'quire', 'mock-command'])
  } catch {
    // Ignore Commander errors
  }

  t.is(thisContext, mockCommand, 'this should be bound to the command instance')
  t.true(debugSpy.called, 'this.debug should be callable')
})

test('postAction hook preserves this context for command methods', async (t) => {
  const { sandbox } = t.context

  const debugSpy = sandbox.spy()
  let thisContext = null

  const mockCommand = createMockCommand({
    debug: debugSpy,
    action: async () => {},
    postAction: function () {
      thisContext = this
      this.debug('postAction called')
    }
  })

  const { default: program } = await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: sandbox.stub()
    }
  })

  program.exitOverride()
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })

  try {
    await program.parseAsync(['node', 'quire', 'mock-command'])
  } catch {
    // Ignore Commander errors
  }

  t.is(thisContext, mockCommand, 'this should be bound to the command instance')
  t.true(debugSpy.called, 'this.debug should be callable')
})

test('async preAction hooks are awaited before action runs', async (t) => {
  const { sandbox } = t.context

  const callOrder = []

  const mockCommand = createMockCommand({
    preAction: async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      callOrder.push('preAction')
    },
    action: async () => {
      callOrder.push('action')
    }
  })

  const { default: program } = await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: sandbox.stub()
    }
  })

  program.exitOverride()
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })

  try {
    await program.parseAsync(['node', 'quire', 'mock-command'])
  } catch {
    // Ignore Commander errors
  }

  t.deepEqual(callOrder, ['preAction', 'action'], 'preAction should complete before action starts')
})

test('async postAction hooks are awaited after action completes', async (t) => {
  const { sandbox } = t.context

  const callOrder = []

  const mockCommand = createMockCommand({
    action: async () => {
      callOrder.push('action')
    },
    postAction: async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      callOrder.push('postAction')
    }
  })

  const { default: program } = await esmock('./main.js', {
    '#src/commands/index.js': {
      default: [mockCommand]
    },
    '#lib/error/handler.js': {
      handleError: sandbox.stub()
    }
  })

  program.exitOverride()
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {}
  })

  try {
    await program.parseAsync(['node', 'quire', 'mock-command'])
  } catch {
    // Ignore Commander errors
  }

  t.deepEqual(callOrder, ['action', 'postAction'], 'postAction should run after action completes')
})

/**
 * Nota bene: preSubcommand hook tests are skipped because:
 * 1. `main` does not process a `subcommands` array in command definitions
 * 2. No commands in the CLI currently use nested subcommands
 * 3. The wrapped error handler pattern is identical to preAction/postAction
 *
 * @todo When nested subcommands are added, these tests should be implemented.
 */
test.skip('preSubcommand hook errors are passed to handleError', async (t) => {
  // Requires main.js to support nested subcommands in command definitions
  t.pass()
})

test.skip('preSubcommand hook preserves this context for command methods', async (t) => {
  // Requires main.js to support nested subcommands in command definitions
  t.pass()
})
