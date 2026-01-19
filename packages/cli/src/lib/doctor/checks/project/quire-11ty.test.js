import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkOutdatedQuire11ty returns ok when quire-11ty is not installed', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { checkOutdatedQuire11ty } = await esmock('./quire-11ty.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(false),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = await checkOutdatedQuire11ty()

  t.true(result.ok)
  t.regex(result.message, /not installed/)
})

test('checkOutdatedQuire11ty returns ok when version is up to date', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { checkOutdatedQuire11ty } = await esmock('./quire-11ty.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        readFileSync: sandbox.stub().returns(JSON.stringify({ version: '1.0.0-rc.33' })),
      },
    },
    'node:path': {
      default: path.default,
    },
    '#lib/npm/index.js': {
      default: {
        view: sandbox.stub().resolves('1.0.0-rc.33'),
      },
    },
    '#lib/conf/config.js': {
      default: {
        get: sandbox.stub().returns('rc'),
      },
    },
  })

  const result = await checkOutdatedQuire11ty()

  t.true(result.ok)
  t.regex(result.message, /1\.0\.0-rc\.33/)
  t.regex(result.message, /up to date/)
})

test('checkOutdatedQuire11ty returns warning when version is outdated', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { checkOutdatedQuire11ty } = await esmock('./quire-11ty.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        readFileSync: sandbox.stub().returns(JSON.stringify({ version: '1.0.0-rc.30' })),
      },
    },
    'node:path': {
      default: path.default,
    },
    '#lib/npm/index.js': {
      default: {
        view: sandbox.stub().resolves('1.0.0-rc.33'),
      },
    },
    '#lib/conf/config.js': {
      default: {
        get: sandbox.stub().returns('rc'),
      },
    },
  })

  const result = await checkOutdatedQuire11ty()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /1\.0\.0-rc\.30 installed/)
  t.regex(result.message, /1\.0\.0-rc\.33 available/)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})

test('checkOutdatedQuire11ty returns warning when cannot read installed version', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { checkOutdatedQuire11ty } = await esmock('./quire-11ty.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        readFileSync: sandbox.stub().throws(new Error('ENOENT')),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = await checkOutdatedQuire11ty()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /Could not read/)
  t.truthy(result.remediation)
})

test('checkOutdatedQuire11ty returns ok with message when network check fails', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { checkOutdatedQuire11ty } = await esmock('./quire-11ty.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        readFileSync: sandbox.stub().returns(JSON.stringify({ version: '1.0.0-rc.30' })),
      },
    },
    'node:path': {
      default: path.default,
    },
    '#lib/npm/index.js': {
      default: {
        view: sandbox.stub().rejects(new Error('Network error')),
      },
    },
    '#lib/conf/config.js': {
      default: {
        get: sandbox.stub().returns('rc'),
      },
    },
  })

  const result = await checkOutdatedQuire11ty()

  t.true(result.ok)
  t.regex(result.message, /1\.0\.0-rc\.30/)
  t.regex(result.message, /could not check/)
})
