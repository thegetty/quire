import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkPandocAvailable returns ok when pandoc is available', async (t) => {
  const { sandbox } = t.context

  const { checkPandocAvailable } = await esmock('./pandoc-available.js', {
    which: {
      sync: sandbox.stub().returns('/usr/local/bin/pandoc'),
    },
  })

  const result = checkPandocAvailable()

  t.true(result.ok)
  t.regex(result.message, /installed/)
  t.is(result.details, '/usr/local/bin/pandoc')
})

test('checkPandocAvailable returns warning when pandoc is missing', async (t) => {
  const { sandbox } = t.context

  const { checkPandocAvailable } = await esmock('./pandoc-available.js', {
    which: {
      sync: sandbox.stub().returns(null),
    },
  })

  const result = checkPandocAvailable()

  t.false(result.ok)
  t.is(result.level, 'warn', 'should be a warning, not an error')
  t.is(result.message, 'not found (optional)')
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})

test('checkPandocAvailable remediation includes download link', async (t) => {
  const { sandbox } = t.context

  const { checkPandocAvailable } = await esmock('./pandoc-available.js', {
    which: {
      sync: sandbox.stub().returns(null),
    },
  })

  const result = checkPandocAvailable()

  t.regex(result.remediation, /pandoc\.org/, 'should include Pandoc download URL')
})

test('checkPandocAvailable remediation mentions --engine pandoc', async (t) => {
  const { sandbox } = t.context

  const { checkPandocAvailable } = await esmock('./pandoc-available.js', {
    which: {
      sync: sandbox.stub().returns(null),
    },
  })

  const result = checkPandocAvailable()

  t.regex(result.remediation, /--engine pandoc/, 'should mention --engine pandoc flag')
})
