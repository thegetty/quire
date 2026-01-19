import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkNpmAvailable returns ok when npm is available', async (t) => {
  const { sandbox } = t.context

  const { checkNpmAvailable } = await esmock('./npm-available.js', {
    '#lib/npm/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(true),
      },
    },
  })

  const result = await checkNpmAvailable()

  t.true(result.ok)
  t.is(result.message, null)
})

test('checkNpmAvailable returns not ok when npm is missing', async (t) => {
  const { sandbox } = t.context

  const { checkNpmAvailable } = await esmock('./npm-available.js', {
    '#lib/npm/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(false),
      },
    },
  })

  const result = await checkNpmAvailable()

  t.false(result.ok)
  t.regex(result.message, /npm not found/)
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})
