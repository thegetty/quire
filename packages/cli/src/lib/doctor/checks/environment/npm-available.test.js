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
        version: sandbox.stub().resolves('10.2.4'),
      },
    },
  })

  const result = await checkNpmAvailable()

  t.true(result.ok)
  t.is(result.message, '10.2.4')
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
  t.is(result.message, 'not found in PATH')
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})
