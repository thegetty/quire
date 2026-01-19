import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkNodeVersion returns ok when version meets requirement', async (t) => {
  const { checkNodeVersion } = await import('./index.js')

  const result = checkNodeVersion()

  // Current Node.js version should be >= 22 in dev environment
  t.is(typeof result.ok, 'boolean')
  t.is(typeof result.message, 'string')
  t.regex(result.message, /v\d+/)
})

test('checkNpmAvailable returns ok when npm is available', async (t) => {
  const { sandbox } = t.context

  const { checkNpmAvailable } = await esmock('./index.js', {
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

  const { checkNpmAvailable } = await esmock('./index.js', {
    '#lib/npm/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(false),
      },
    },
  })

  const result = await checkNpmAvailable()

  t.false(result.ok)
  t.regex(result.message, /npm not found/)
})

test('checkGitAvailable returns ok when git is available', async (t) => {
  const { sandbox } = t.context

  const { checkGitAvailable } = await esmock('./index.js', {
    '#lib/git/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(true),
      },
    },
  })

  const result = await checkGitAvailable()

  t.true(result.ok)
  t.is(result.message, null)
})

test('checkGitAvailable returns not ok when git is missing', async (t) => {
  const { sandbox } = t.context

  const { checkGitAvailable } = await esmock('./index.js', {
    '#lib/git/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(false),
      },
    },
  })

  const result = await checkGitAvailable()

  t.false(result.ok)
  t.regex(result.message, /Git not found/)
})

test('checkQuireProject returns ok when marker file exists', async (t) => {
  const { sandbox } = t.context

  const { checkQuireProject } = await esmock('./index.js', {
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

  const { checkQuireProject } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(false),
      },
    },
  })

  const result = checkQuireProject()

  t.false(result.ok)
  t.regex(result.message, /No Quire project marker/)
})

test('checkDependencies returns ok when node_modules exists', async (t) => {
  const { sandbox } = t.context

  const { checkDependencies } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
      },
    },
  })

  const result = checkDependencies()

  t.true(result.ok)
})

test('checkDependencies returns not ok when node_modules missing', async (t) => {
  const { sandbox } = t.context

  const { checkDependencies } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().callsFake((path) => path === 'package.json'),
      },
    },
  })

  const result = checkDependencies()

  t.false(result.ok)
  t.regex(result.message, /npm install/)
})

test('runAllChecks runs all checks and returns results', async (t) => {
  const { sandbox } = t.context

  const { runAllChecks } = await esmock('./index.js', {
    '#lib/git/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(true),
      },
    },
    '#lib/npm/index.js': {
      default: {
        isAvailable: sandbox.stub().resolves(true),
      },
    },
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
      },
    },
  })

  const results = await runAllChecks()

  t.true(Array.isArray(results))
  t.is(results.length, 5)

  for (const result of results) {
    t.is(typeof result.name, 'string')
    t.is(typeof result.ok, 'boolean')
  }
})

test('checks array exports all check definitions', async (t) => {
  const { checks } = await import('./index.js')

  t.true(Array.isArray(checks))
  t.is(checks.length, 5)

  const checkNames = checks.map((c) => c.name)
  t.true(checkNames.includes('Node.js version'))
  t.true(checkNames.includes('npm available'))
  t.true(checkNames.includes('Git available'))
  t.true(checkNames.includes('Quire project detected'))
  t.true(checkNames.includes('Dependencies installed'))
})

test('default export includes all functions', async (t) => {
  const doctor = await import('./index.js')

  t.is(typeof doctor.default.runAllChecks, 'function')
  t.is(typeof doctor.default.checkNodeVersion, 'function')
  t.is(typeof doctor.default.checkNpmAvailable, 'function')
  t.is(typeof doctor.default.checkGitAvailable, 'function')
  t.is(typeof doctor.default.checkQuireProject, 'function')
  t.is(typeof doctor.default.checkDependencies, 'function')
})
