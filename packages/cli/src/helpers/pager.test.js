import sinon from 'sinon'
import test from 'ava'

/**
 * Pager Helper Tests
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test.serial('outputWithPaging() writes directly when not a TTY', async (t) => {
  const { sandbox } = t.context
  const originalIsTTY = process.stdout.isTTY
  const stdoutWrite = sandbox.stub(process.stdout, 'write')

  try {
    // Simulate non-TTY (piped output)
    Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true })

    const { outputWithPaging } = await import('./pager.js')
    await outputWithPaging('Short content')

    t.true(stdoutWrite.calledWith('Short content\n'))
  } finally {
    Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, configurable: true })
  }
})

test.serial('outputWithPaging() writes directly when content is short', async (t) => {
  const { sandbox } = t.context
  const originalIsTTY = process.stdout.isTTY
  const originalRows = process.stdout.rows
  const stdoutWrite = sandbox.stub(process.stdout, 'write')

  try {
    // Simulate TTY with 24 rows
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true })
    Object.defineProperty(process.stdout, 'rows', { value: 24, configurable: true })

    const { outputWithPaging } = await import('./pager.js')
    await outputWithPaging('Line 1\nLine 2\nLine 3')

    t.true(stdoutWrite.calledWith('Line 1\nLine 2\nLine 3\n'))
  } finally {
    Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, configurable: true })
    Object.defineProperty(process.stdout, 'rows', { value: originalRows, configurable: true })
  }
})

test.serial('outputWithPaging() writes directly when NO_PAGER is set', async (t) => {
  const { sandbox } = t.context
  const originalIsTTY = process.stdout.isTTY
  const originalRows = process.stdout.rows
  const originalNoPager = process.env.NO_PAGER
  const stdoutWrite = sandbox.stub(process.stdout, 'write')

  try {
    // Simulate TTY with small terminal (would normally trigger pager)
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true })
    Object.defineProperty(process.stdout, 'rows', { value: 5, configurable: true })
    process.env.NO_PAGER = '1'

    const { outputWithPaging } = await import('./pager.js')

    // Content longer than terminal height
    const longContent = Array.from({ length: 20 }, (_, i) => `Line ${i + 1}`).join('\n')
    await outputWithPaging(longContent)

    // Should write directly despite long content, because pager is disabled
    t.true(stdoutWrite.calledWith(longContent + '\n'))
  } finally {
    Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY, configurable: true })
    Object.defineProperty(process.stdout, 'rows', { value: originalRows, configurable: true })
    if (originalNoPager === undefined) {
      delete process.env.NO_PAGER
    } else {
      process.env.NO_PAGER = originalNoPager
    }
  }
})
