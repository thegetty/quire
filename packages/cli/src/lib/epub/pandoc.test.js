import esmock from 'esmock'
import path from 'node:path'
import sinon from 'sinon'
import test from 'ava'

/**
 * Pandoc EPUB Engine Integration Tests
 *
 * Tests error handling and logging paths that are difficult to trigger in E2E tests.
 * The happy path is covered by E2E tests with real Pandoc installation.
 */

/**
 * Create a cross-platform absolute path for testing
 * @param {...string} segments - Path segments to join
 * @returns {string} Platform-appropriate absolute path
 */
function testPath(...segments) {
  const root = process.platform === 'win32' ? 'C:\\' : '/'
  return path.join(root, ...segments)
}

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()

  // Mock fs-extra
  t.context.mockFs = {
    readdirSync: t.context.sandbox.stub().returns(['chapter1.xhtml', 'chapter2.xhtml']),
    lstatSync: t.context.sandbox.stub().returns({ isFile: () => true })
  }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('pandoc logs stderr via debug when present', async (t) => {
  const { sandbox, mockFs } = t.context

  const mockExeca = sandbox.stub().resolves({ stderr: 'warning: deprecated option used' })
  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const pandoc = await esmock('./pandoc.js', {
    execa: { execa: mockExeca },
    'fs-extra': mockFs,
    '#debug': { default: mockCreateDebug }
  })

  await pandoc.default(testPath('input'), testPath('output.epub'), {})

  t.true(mockDebug.calledWith('pandoc stderr: %s', 'warning: deprecated option used'))
})

test('pandoc does not log stderr when empty', async (t) => {
  const { sandbox, mockFs } = t.context

  const mockExeca = sandbox.stub().resolves({ stderr: '' })
  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const pandoc = await esmock('./pandoc.js', {
    execa: { execa: mockExeca },
    'fs-extra': mockFs,
    '#debug': { default: mockCreateDebug }
  })

  await pandoc.default(testPath('input'), testPath('output.epub'), {})

  t.false(mockDebug.calledWith(sinon.match('pandoc stderr')))
})

test('pandoc throws EpubGenerationError when execa fails', async (t) => {
  const { sandbox, mockFs } = t.context

  const execaError = new Error('Pandoc failed')
  execaError.stderr = 'error: unknown input format'

  const mockExeca = sandbox.stub().rejects(execaError)

  const pandoc = await esmock('./pandoc.js', {
    execa: { execa: mockExeca },
    'fs-extra': mockFs
  })

  const error = await t.throwsAsync(() =>
    pandoc.default(testPath('input'), testPath('output.epub'), {})
  )

  t.is(error.code, 'EPUB_FAILED')
  // EpubGenerationError formats message as: "EPUB generation failed: <details>"
  // where <details> includes tool name, operation, and stderr/message
  t.true(error.message.includes('EPUB generation failed'))
  t.true(error.message.includes('Pandoc'))
  t.true(error.message.includes('unknown input format'))
})

test('pandoc filters only XHTML files from input directory', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stderr: '' })

  // Mock readdirSync to return mixed files
  const mockFs = {
    readdirSync: sandbox.stub().returns(['chapter1.xhtml', 'image.png', 'chapter2.xhtml', 'style.css']),
    lstatSync: sandbox.stub().returns({ isFile: () => true })
  }

  const pandoc = await esmock('./pandoc.js', {
    execa: { execa: mockExeca },
    'fs-extra': mockFs
  })

  await pandoc.default(testPath('input'), testPath('output.epub'), {})

  // Verify only XHTML files were passed to pandoc
  const [, args] = mockExeca.firstCall.args
  const inputFiles = args.filter(arg => arg.endsWith('.xhtml'))
  t.is(inputFiles.length, 2)
  t.true(inputFiles[0].endsWith('chapter1.xhtml'))
  t.true(inputFiles[1].endsWith('chapter2.xhtml'))
})
