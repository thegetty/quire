import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

/**
 * ProcessManager Unit Tests
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
  }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('processManager exports signal and handler methods', async (t) => {
  const { mockLogger } = t.context
  const processManager = await esmock('./manager.js', {
    '#src/lib/logger.js': { default: mockLogger },
  })

  t.truthy(processManager.default.signal)
  t.is(typeof processManager.default.onShutdown, 'function')
  t.is(typeof processManager.default.onShutdownComplete, 'function')
})

test('processManager.signal is an AbortSignal', async (t) => {
  const { mockLogger } = t.context
  const processManager = await esmock('./manager.js', {
    '#src/lib/logger.js': { default: mockLogger },
  })

  t.true(processManager.default.signal instanceof AbortSignal)
})

test('onShutdown/onShutdownComplete register and remove handlers', async (t) => {
  const { sandbox, mockLogger } = t.context
  const processManager = await esmock('./manager.js', {
    '#src/lib/logger.js': { default: mockLogger },
  })
  const cleanup = sandbox.stub()

  // Should not throw
  processManager.default.onShutdown('test', cleanup)
  processManager.default.onShutdownComplete('test')
  t.pass()
})
