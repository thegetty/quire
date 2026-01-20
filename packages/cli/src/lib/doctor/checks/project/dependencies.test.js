import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkDependencies returns ok when node_modules exists', async (t) => {
  const { sandbox } = t.context

  const { checkDependencies } = await esmock('./dependencies.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
      },
    },
    'node:path': {
      default: {
        resolve: sandbox.stub().callsFake((p) => `/test/project/${p}`),
      },
    },
  })

  const result = checkDependencies()

  t.true(result.ok)
  t.is(result.message, 'installed')
  t.is(result.details, '/test/project/node_modules')
})

test('checkDependencies returns not ok when node_modules missing', async (t) => {
  const { sandbox } = t.context

  const { checkDependencies } = await esmock('./dependencies.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().callsFake((path) => path === 'package.json'),
      },
    },
  })

  const result = checkDependencies()

  t.false(result.ok)
  t.regex(result.message, /node_modules not found/)
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})

test('checkDependencies returns N/A when no package.json (not in project)', async (t) => {
  const { sandbox } = t.context

  const { checkDependencies } = await esmock('./dependencies.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(false),
      },
    },
  })

  const result = checkDependencies()

  t.true(result.ok)
  t.is(result.level, 'na', 'should return N/A level when not in project')
  t.regex(result.message, /No package\.json/)
})
