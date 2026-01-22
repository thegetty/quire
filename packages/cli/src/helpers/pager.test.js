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
