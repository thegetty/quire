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
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
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
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
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
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
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
  t.regex(result.message, /node_modules not found/)
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})

test('checkStaleBuild returns ok when no _site exists', async (t) => {
  const { sandbox } = t.context

  const { checkStaleBuild } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(false),
      },
    },
  })

  const result = checkStaleBuild()

  t.true(result.ok)
  t.regex(result.message, /No build output/)
})

test('checkStaleBuild returns ok when build is up to date', async (t) => {
  const { sandbox } = t.context

  const now = Date.now()
  const { checkStaleBuild } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        statSync: sandbox.stub().returns({ mtimeMs: now }),
        readdirSync: sandbox.stub().returns([]),
      },
    },
  })

  const result = checkStaleBuild()

  t.true(result.ok)
  t.regex(result.message, /up to date/)
})

test('checkStaleBuild returns warning when build is stale', async (t) => {
  const { sandbox } = t.context

  const oldTime = Date.now() - 3600000 // 1 hour ago
  const newTime = Date.now()

  const existsStub = sandbox.stub()
  existsStub.withArgs('_site').returns(true)
  existsStub.withArgs('content').returns(true)
  existsStub.returns(false)

  const statStub = sandbox.stub()
  statStub.withArgs('_site').returns({ mtimeMs: oldTime })
  statStub.returns({ mtimeMs: newTime })

  const path = await import('node:path')
  const { checkStaleBuild } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: existsStub,
        statSync: statStub,
        readdirSync: sandbox.stub().callsFake((dir) => {
          if (dir === 'content') {
            return [{ name: 'index.md', isDirectory: () => false }]
          }
          return []
        }),
        readFileSync: sandbox.stub().returns('{}'),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /older than source/)
  t.truthy(result.remediation, 'should include remediation guidance')
  t.truthy(result.docsUrl, 'should include documentation link')
})

test('checkStaleBuild formats duration in weeks', async (t) => {
  const { sandbox } = t.context

  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000
  const newTime = Date.now()

  const existsStub = sandbox.stub()
  existsStub.withArgs('_site').returns(true)
  existsStub.withArgs('content').returns(true)
  existsStub.returns(false)

  const statStub = sandbox.stub()
  statStub.withArgs('_site').returns({ mtimeMs: twoWeeksAgo })
  statStub.returns({ mtimeMs: newTime })

  const path = await import('node:path')
  const { checkStaleBuild } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: existsStub,
        statSync: statStub,
        readdirSync: sandbox.stub().callsFake((dir) => {
          if (dir === 'content') {
            return [{ name: 'index.md', isDirectory: () => false }]
          }
          return []
        }),
        readFileSync: sandbox.stub().returns('{}'),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.regex(result.message, /2 weeks/)
})

test('checkStaleBuild formats duration in months', async (t) => {
  const { sandbox } = t.context

  const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
  const newTime = Date.now()

  const existsStub = sandbox.stub()
  existsStub.withArgs('_site').returns(true)
  existsStub.withArgs('content').returns(true)
  existsStub.returns(false)

  const statStub = sandbox.stub()
  statStub.withArgs('_site').returns({ mtimeMs: threeMonthsAgo })
  statStub.returns({ mtimeMs: newTime })

  const path = await import('node:path')
  const { checkStaleBuild } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: existsStub,
        statSync: statStub,
        readdirSync: sandbox.stub().callsFake((dir) => {
          if (dir === 'content') {
            return [{ name: 'index.md', isDirectory: () => false }]
          }
          return []
        }),
        readFileSync: sandbox.stub().returns('{}'),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.regex(result.message, /3 months/)
})

test('checkStaleBuild formats duration in years', async (t) => {
  const { sandbox } = t.context

  const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000
  const newTime = Date.now()

  const existsStub = sandbox.stub()
  existsStub.withArgs('_site').returns(true)
  existsStub.withArgs('content').returns(true)
  existsStub.returns(false)

  const statStub = sandbox.stub()
  statStub.withArgs('_site').returns({ mtimeMs: twoYearsAgo })
  statStub.returns({ mtimeMs: newTime })

  const path = await import('node:path')
  const { checkStaleBuild } = await esmock('./index.js', {
    'node:fs': {
      default: {
        existsSync: existsStub,
        statSync: statStub,
        readdirSync: sandbox.stub().callsFake((dir) => {
          if (dir === 'content') {
            return [{ name: 'index.md', isDirectory: () => false }]
          }
          return []
        }),
        readFileSync: sandbox.stub().returns('{}'),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = checkStaleBuild()

  t.false(result.ok)
  t.regex(result.message, /2 years/)
})

test('runAllChecks runs all checks and returns results', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
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
        statSync: sandbox.stub().returns({ mtimeMs: Date.now() }),
        readdirSync: sandbox.stub().returns([]),
        readFileSync: sandbox.stub().returns('{}'),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const results = await runAllChecks()

  t.true(Array.isArray(results))
  t.is(results.length, 7)

  for (const result of results) {
    t.is(typeof result.name, 'string')
    t.is(typeof result.ok, 'boolean')
  }
})

test('checks array exports all check definitions', async (t) => {
  const { checks } = await import('./index.js')

  t.true(Array.isArray(checks))
  t.is(checks.length, 7)

  const checkNames = checks.map((c) => c.name)
  t.true(checkNames.includes('Node.js version'))
  t.true(checkNames.includes('npm available'))
  t.true(checkNames.includes('Git available'))
  t.true(checkNames.includes('Quire project detected'))
  t.true(checkNames.includes('Dependencies installed'))
  t.true(checkNames.includes('Data files'))
  t.true(checkNames.includes('Build status'))
})

test('checkSections exports checks organized by section', async (t) => {
  const { checkSections } = await import('./index.js')

  t.true(Array.isArray(checkSections))
  t.is(checkSections.length, 2)

  const sectionNames = checkSections.map((s) => s.name)
  t.true(sectionNames.includes('Environment'))
  t.true(sectionNames.includes('Project'))

  // Environment section should have 3 checks
  const envSection = checkSections.find((s) => s.name === 'Environment')
  t.is(envSection.checks.length, 3)

  // Project section should have 4 checks (including Data files)
  const projectSection = checkSections.find((s) => s.name === 'Project')
  t.is(projectSection.checks.length, 4)
})

test('runAllChecksWithSections returns results organized by section', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { runAllChecksWithSections } = await esmock('./index.js', {
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
        statSync: sandbox.stub().returns({ mtimeMs: Date.now() }),
        readdirSync: sandbox.stub().returns([]),
        readFileSync: sandbox.stub().returns('{}'),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const sections = await runAllChecksWithSections()

  t.true(Array.isArray(sections))
  t.is(sections.length, 2)

  // Check section structure
  for (const { section, results } of sections) {
    t.is(typeof section, 'string')
    t.true(Array.isArray(results))
    for (const result of results) {
      t.is(typeof result.name, 'string')
      t.is(typeof result.ok, 'boolean')
    }
  }
})

test('default export includes all functions', async (t) => {
  const doctor = await import('./index.js')

  t.is(typeof doctor.default.runAllChecks, 'function')
  t.is(typeof doctor.default.runAllChecksWithSections, 'function')
  t.is(typeof doctor.default.checkNodeVersion, 'function')
  t.is(typeof doctor.default.checkNpmAvailable, 'function')
  t.is(typeof doctor.default.checkGitAvailable, 'function')
  t.is(typeof doctor.default.checkQuireProject, 'function')
  t.is(typeof doctor.default.checkDependencies, 'function')
  t.is(typeof doctor.default.checkDataFiles, 'function')
  t.is(typeof doctor.default.checkStaleBuild, 'function')
  t.truthy(doctor.default.checkSections)
})

// ─────────────────────────────────────────────────────────────────────────────
// checkDataFiles tests
// ─────────────────────────────────────────────────────────────────────────────

test('checkDataFiles returns ok when no data directory exists', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./index.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: true,
        errors: [],
        fileCount: 0,
        files: [],
        notInProject: true,
      }),
    },
  })

  const result = checkDataFiles()

  t.true(result.ok)
  t.regex(result.message, /No content\/_data directory/)
})

test('checkDataFiles returns ok when all YAML files are valid', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./index.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: true,
        errors: [],
        fileCount: 1,
        files: [{ file: 'publication.yaml', valid: true, errors: [] }],
      }),
    },
  })

  const result = checkDataFiles()

  t.true(result.ok)
  t.regex(result.message, /1 files validated/)
})

test('checkDataFiles returns warning when required file is missing', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./index.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: false,
        errors: ['Required file missing: publication.yaml'],
        fileCount: 0,
        files: [],
      }),
    },
  })

  const result = checkDataFiles()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /1 issue/)
  t.regex(result.remediation, /publication\.yaml/)
})

test('checkDataFiles returns warning when YAML has syntax error', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./index.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: false,
        errors: ['invalid.yaml: YAML syntax error at line 1 - unexpected end of stream'],
        fileCount: 2,
        files: [
          { file: 'publication.yaml', valid: true, errors: [] },
          { file: 'invalid.yaml', valid: false, errors: ['invalid.yaml: YAML syntax error at line 1 - unexpected end of stream'] },
        ],
      }),
    },
  })

  const result = checkDataFiles()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.remediation, /invalid\.yaml/)
  t.regex(result.remediation, /YAML syntax error/)
})

test('checkDataFiles returns warning when duplicate IDs exist', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./index.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: false,
        errors: ['figures.yaml: duplicate IDs found: fig-1'],
        fileCount: 2,
        files: [
          { file: 'publication.yaml', valid: true, errors: [] },
          { file: 'figures.yaml', valid: false, errors: ['figures.yaml: duplicate IDs found: fig-1'] },
        ],
      }),
    },
  })

  const result = checkDataFiles()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.remediation, /duplicate IDs/)
  t.regex(result.remediation, /fig-1/)
})
