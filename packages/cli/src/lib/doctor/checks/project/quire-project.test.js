import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkQuireProject returns ok when marker file exists', async (t) => {
  const { sandbox } = t.context

  const { checkQuireProject } = await esmock('./quire-project.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().callsFake((path) => path === '.quire'),
      },
    },
  })

  const result = checkQuireProject()

  t.true(result.ok)
  t.regex(result.message, /Detected via \.quire/)
})

test('checkQuireProject returns not ok when no marker file exists', async (t) => {
  const { sandbox } = t.context

  const { checkQuireProject } = await esmock('./quire-project.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(false),
      },
    },
  })

  const result = checkQuireProject()

  t.false(result.ok)
  t.regex(result.message, /No Quire project marker/)
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})
