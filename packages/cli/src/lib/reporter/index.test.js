import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'
import reporter, { Reporter } from './index.js'

/**
 * Reporter Module Tests
 *
 * Tests the Reporter class and singleton behavior for CLI progress feedback.
 * Uses esmock to mock ora for controlled testing.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  // Reset reporter state before each test
  reporter.reset()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
  reporter.reset()
})

// ─────────────────────────────────────────────────────────────────────────────
// Singleton behavior tests
// ─────────────────────────────────────────────────────────────────────────────

test('default export is a Reporter instance', (t) => {
  t.true(reporter instanceof Reporter)
})

test('Reporter class is exported for testing', (t) => {
  t.is(typeof Reporter, 'function')
  const instance = new Reporter()
  t.true(instance instanceof Reporter)
})

// ─────────────────────────────────────────────────────────────────────────────
// Configuration tests
// ─────────────────────────────────────────────────────────────────────────────

test('configure() sets quiet mode', (t) => {
  reporter.configure({ quiet: true })
  // Spinner should be suppressed - verify by checking isSpinning after start
  reporter.start('Test')
  t.false(reporter.isSpinning())
})

test('configure() sets json mode', (t) => {
  reporter.configure({ json: true })
  reporter.start('Test')
  t.false(reporter.isSpinning())
})

test('configure() returns this for chaining', (t) => {
  const result = reporter.configure({ quiet: false })
  t.is(result, reporter)
})

test('configure() resets previous configuration', (t) => {
  reporter.configure({ quiet: true })
  reporter.configure({ quiet: false })
  // After reset, spinner should work (if TTY)
  // Can't test TTY directly, but verify configure doesn't throw
  t.notThrows(() => reporter.configure({}))
})

// ─────────────────────────────────────────────────────────────────────────────
// Start/stop tests
// ─────────────────────────────────────────────────────────────────────────────

test('start() returns this for chaining', (t) => {
  reporter.configure({ quiet: true })
  const result = reporter.start('Test')
  t.is(result, reporter)
})

test('stop() returns this for chaining', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  const result = reporter.stop()
  t.is(result, reporter)
})

test('stop() clears spinner state', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  reporter.stop()
  t.false(reporter.isSpinning())
})

test('start() stops previous spinner before starting new one', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('First')
  reporter.start('Second')
  // Should not throw, previous spinner should be stopped
  t.pass()
})

// ─────────────────────────────────────────────────────────────────────────────
// Update tests
// ─────────────────────────────────────────────────────────────────────────────

test('update() returns this for chaining', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Initial')
  const result = reporter.update('Updated')
  t.is(result, reporter)
})

test('update() starts spinner if none running', (t) => {
  reporter.configure({ quiet: true })
  reporter.update('Auto-start')
  // Should not throw
  t.pass()
})

// ─────────────────────────────────────────────────────────────────────────────
// Status completion tests
// ─────────────────────────────────────────────────────────────────────────────

test('succeed() returns this for chaining', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  const result = reporter.succeed('Done')
  t.is(result, reporter)
})

test('succeed() clears spinner', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  reporter.succeed('Done')
  t.false(reporter.isSpinning())
})

test('succeed() without text uses base text', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Base message')
  reporter.succeed()
  // Should not throw
  t.pass()
})

test('fail() returns this for chaining', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  const result = reporter.fail('Failed')
  t.is(result, reporter)
})

test('fail() clears spinner', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  reporter.fail('Failed')
  t.false(reporter.isSpinning())
})

test('warn() returns this for chaining', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  const result = reporter.warn('Warning')
  t.is(result, reporter)
})

test('warn() clears spinner', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  reporter.warn('Warning')
  t.false(reporter.isSpinning())
})

test('info() returns this for chaining', (t) => {
  reporter.configure({ quiet: true })
  const result = reporter.info('Info message')
  t.is(result, reporter)
})

// ─────────────────────────────────────────────────────────────────────────────
// Elapsed time tests
// ─────────────────────────────────────────────────────────────────────────────

test('getElapsed() returns null before start', (t) => {
  reporter.reset()
  t.is(reporter.getElapsed(), null)
})

test('getElapsed() returns elapsed time after start', async (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')

  // Wait a small amount
  await new Promise((resolve) => setTimeout(resolve, 50))

  const elapsed = reporter.getElapsed()
  t.true(typeof elapsed === 'number')
  t.true(elapsed >= 50)
})

test('elapsed timer is cleared on succeed', async (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test', { showElapsed: true })
  await new Promise((resolve) => setTimeout(resolve, 10))
  reporter.succeed()
  // Timer should be stopped - no way to directly test, but ensure no errors
  t.pass()
})

test('elapsed timer is cleared on fail', async (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test', { showElapsed: true })
  await new Promise((resolve) => setTimeout(resolve, 10))
  reporter.fail()
  t.pass()
})

test('elapsed timer is cleared on stop', async (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test', { showElapsed: true })
  await new Promise((resolve) => setTimeout(resolve, 10))
  reporter.stop()
  t.pass()
})

// ─────────────────────────────────────────────────────────────────────────────
// Reset tests
// ─────────────────────────────────────────────────────────────────────────────

test('reset() returns this for chaining', (t) => {
  const result = reporter.reset()
  t.is(result, reporter)
})

test('reset() clears all state', (t) => {
  reporter.configure({ quiet: true, json: true })
  reporter.start('Test')
  reporter.reset()

  t.false(reporter.isSpinning())
  t.is(reporter.getElapsed(), null)
})

// ─────────────────────────────────────────────────────────────────────────────
// isSpinning tests
// ─────────────────────────────────────────────────────────────────────────────

test('isSpinning() returns false initially', (t) => {
  reporter.reset()
  t.false(reporter.isSpinning())
})

test('isSpinning() returns false in quiet mode', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Test')
  t.false(reporter.isSpinning())
})

// ─────────────────────────────────────────────────────────────────────────────
// Integration tests with mocked ora
// ─────────────────────────────────────────────────────────────────────────────

test.serial('start() calls ora with correct text', async (t) => {
  const { sandbox } = t.context
  const mockOraInstance = {
    start: sandbox.stub().returnsThis(),
    stop: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    warn: sandbox.stub().returnsThis(),
    info: sandbox.stub().returnsThis(),
    isSpinning: true,
    text: '',
  }
  const mockOra = sandbox.stub().returns(mockOraInstance)

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  // Mock isTTY to enable spinner
  const originalIsTTY = process.stdout.isTTY
  process.stdout.isTTY = true

  try {
    const rep = new MockedReporter()
    rep.start('Building...')

    t.true(mockOra.calledOnce)
    t.deepEqual(mockOra.firstCall.args[0], {
      text: 'Building...',
      spinner: 'dots',
    })
  } finally {
    process.stdout.isTTY = originalIsTTY
  }
})

test.serial('succeed() calls ora.succeed with text', async (t) => {
  const { sandbox } = t.context
  const mockOraInstance = {
    start: sandbox.stub().returnsThis(),
    stop: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    warn: sandbox.stub().returnsThis(),
    info: sandbox.stub().returnsThis(),
    isSpinning: true,
    text: '',
  }
  const mockOra = sandbox.stub().returns(mockOraInstance)

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const originalIsTTY = process.stdout.isTTY
  process.stdout.isTTY = true

  try {
    const rep = new MockedReporter()
    rep.start('Building...')
    rep.succeed('Build complete')

    t.true(mockOraInstance.succeed.calledOnce)
    t.is(mockOraInstance.succeed.firstCall.args[0], 'Build complete')
  } finally {
    process.stdout.isTTY = originalIsTTY
  }
})

test.serial('fail() calls ora.fail with text', async (t) => {
  const { sandbox } = t.context
  const mockOraInstance = {
    start: sandbox.stub().returnsThis(),
    stop: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    warn: sandbox.stub().returnsThis(),
    info: sandbox.stub().returnsThis(),
    isSpinning: true,
    text: '',
  }
  const mockOra = sandbox.stub().returns(mockOraInstance)

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const originalIsTTY = process.stdout.isTTY
  process.stdout.isTTY = true

  try {
    const rep = new MockedReporter()
    rep.start('Generating PDF...')
    rep.fail('PDF generation failed')

    t.true(mockOraInstance.fail.calledOnce)
    t.is(mockOraInstance.fail.firstCall.args[0], 'PDF generation failed')
  } finally {
    process.stdout.isTTY = originalIsTTY
  }
})

test.serial('warn() calls ora.warn with text', async (t) => {
  const { sandbox } = t.context
  const mockOraInstance = {
    start: sandbox.stub().returnsThis(),
    stop: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    warn: sandbox.stub().returnsThis(),
    info: sandbox.stub().returnsThis(),
    isSpinning: true,
    text: '',
  }
  const mockOra = sandbox.stub().returns(mockOraInstance)

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const originalIsTTY = process.stdout.isTTY
  process.stdout.isTTY = true

  try {
    const rep = new MockedReporter()
    rep.start('Checking...')
    rep.warn('Dependencies outdated')

    t.true(mockOraInstance.warn.calledOnce)
    t.is(mockOraInstance.warn.firstCall.args[0], 'Dependencies outdated')
  } finally {
    process.stdout.isTTY = originalIsTTY
  }
})

test.serial('update() changes spinner text', async (t) => {
  const { sandbox } = t.context
  const mockOraInstance = {
    start: sandbox.stub().returnsThis(),
    stop: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    warn: sandbox.stub().returnsThis(),
    info: sandbox.stub().returnsThis(),
    isSpinning: true,
    text: '',
  }
  const mockOra = sandbox.stub().returns(mockOraInstance)

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const originalIsTTY = process.stdout.isTTY
  process.stdout.isTTY = true

  try {
    const rep = new MockedReporter()
    rep.start('Step 1...')
    rep.update('Step 2...')

    t.is(mockOraInstance.text, 'Step 2...')
  } finally {
    process.stdout.isTTY = originalIsTTY
  }
})

test.serial('spinner is not created when quiet=true', async (t) => {
  const { sandbox } = t.context
  const mockOra = sandbox.stub()

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const rep = new MockedReporter()
  rep.configure({ quiet: true })
  rep.start('Should not create spinner')

  t.false(mockOra.called)
})

test.serial('spinner is not created when json=true', async (t) => {
  const { sandbox } = t.context
  const mockOra = sandbox.stub()

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const rep = new MockedReporter()
  rep.configure({ json: true })
  rep.start('Should not create spinner')

  t.false(mockOra.called)
})

test.serial('spinner is not created when not TTY', async (t) => {
  const { sandbox } = t.context
  const mockOra = sandbox.stub()

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const originalIsTTY = process.stdout.isTTY
  process.stdout.isTTY = false

  try {
    const rep = new MockedReporter()
    rep.start('Should not create spinner')

    t.false(mockOra.called)
  } finally {
    process.stdout.isTTY = originalIsTTY
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Elapsed time display tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('showElapsed option updates spinner text with time', async (t) => {
  const { sandbox } = t.context
  const mockOraInstance = {
    start: sandbox.stub().returnsThis(),
    stop: sandbox.stub().returnsThis(),
    succeed: sandbox.stub().returnsThis(),
    fail: sandbox.stub().returnsThis(),
    warn: sandbox.stub().returnsThis(),
    info: sandbox.stub().returnsThis(),
    isSpinning: true,
    text: '',
  }
  const mockOra = sandbox.stub().returns(mockOraInstance)

  const { Reporter: MockedReporter } = await esmock('./index.js', {
    ora: { default: mockOra },
  })

  const originalIsTTY = process.stdout.isTTY
  process.stdout.isTTY = true

  try {
    const rep = new MockedReporter()
    rep.start('Building...', { showElapsed: true })

    // Wait for timer to tick
    await new Promise((resolve) => setTimeout(resolve, 1100))

    // Text should include elapsed time
    t.true(mockOraInstance.text.includes('(1s)'))
  } finally {
    process.stdout.isTTY = originalIsTTY
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Method call safety tests
// ─────────────────────────────────────────────────────────────────────────────

test('calling succeed without start does not throw', (t) => {
  reporter.reset()
  t.notThrows(() => reporter.succeed('Done'))
})

test('calling fail without start does not throw', (t) => {
  reporter.reset()
  t.notThrows(() => reporter.fail('Failed'))
})

test('calling warn without start does not throw', (t) => {
  reporter.reset()
  t.notThrows(() => reporter.warn('Warning'))
})

test('calling stop without start does not throw', (t) => {
  reporter.reset()
  t.notThrows(() => reporter.stop())
})

test('calling update without start does not throw', (t) => {
  reporter.reset()
  t.notThrows(() => reporter.update('Update'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Workflow tests
// ─────────────────────────────────────────────────────────────────────────────

test('typical success workflow', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Step 1...')
  reporter.update('Step 2...')
  reporter.update('Step 3...')
  reporter.succeed('All steps complete')
  t.pass()
})

test('typical failure workflow', (t) => {
  reporter.configure({ quiet: true })
  reporter.start('Processing...')
  reporter.fail('Processing failed')
  t.pass()
})

test('multi-phase workflow with different outcomes', (t) => {
  reporter.configure({ quiet: true })

  // Phase 1: success
  reporter.start('Phase 1...')
  reporter.succeed('Phase 1 complete')

  // Phase 2: warning
  reporter.start('Phase 2...')
  reporter.warn('Phase 2 completed with warnings')

  // Phase 3: failure
  reporter.start('Phase 3...')
  reporter.fail('Phase 3 failed')

  t.pass()
})
