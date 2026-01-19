import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkPrinceAvailable returns ok when prince is available', async (t) => {
  const { sandbox } = t.context

  const { checkPrinceAvailable } = await esmock('./prince-available.js', {
    which: {
      sync: sandbox.stub().returns('/usr/local/bin/prince'),
    },
  })

  const result = checkPrinceAvailable()

  t.true(result.ok)
  t.regex(result.message, /installed/)
})

test('checkPrinceAvailable returns warning when prince is missing', async (t) => {
  const { sandbox } = t.context

  const { checkPrinceAvailable } = await esmock('./prince-available.js', {
    which: {
      sync: sandbox.stub().returns(null),
    },
  })

  const result = checkPrinceAvailable()

  t.false(result.ok)
  t.is(result.level, 'warn', 'should be a warning, not an error')
  t.regex(result.message, /not found/)
  t.regex(result.message, /optional/, 'should indicate PrinceXML is optional')
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})

test('checkPrinceAvailable remediation includes download link', async (t) => {
  const { sandbox } = t.context

  const { checkPrinceAvailable } = await esmock('./prince-available.js', {
    which: {
      sync: sandbox.stub().returns(null),
    },
  })

  const result = checkPrinceAvailable()

  t.regex(result.remediation, /princexml\.com/, 'should include PrinceXML download URL')
})

test('checkPrinceAvailable remediation mentions --engine prince', async (t) => {
  const { sandbox } = t.context

  const { checkPrinceAvailable } = await esmock('./prince-available.js', {
    which: {
      sync: sandbox.stub().returns(null),
    },
  })

  const result = checkPrinceAvailable()

  t.regex(result.remediation, /--engine prince/, 'should mention --engine prince flag')
})
