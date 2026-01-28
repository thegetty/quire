import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkGitAvailable returns ok when git is available', async (t) => {
  const { sandbox } = t.context

  const { checkGitAvailable } = await esmock('./git-available.js', {
    '#lib/git/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(true),
        version: sandbox.stub().resolves('2.43.0'),
      },
    },
    which: {
      sync: sandbox.stub().returns('/usr/bin/git'),
    },
  })

  const result = await checkGitAvailable()

  t.true(result.ok)
  t.is(result.message, '2.43.0')
  t.is(result.details, '/usr/bin/git')
})

test('checkGitAvailable returns not ok when git is missing', async (t) => {
  const { sandbox } = t.context

  const { checkGitAvailable } = await esmock('./git-available.js', {
    '#lib/git/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(false),
      },
    },
  })

  const result = await checkGitAvailable()

  t.false(result.ok)
  t.is(result.message, 'not found in PATH')
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})
