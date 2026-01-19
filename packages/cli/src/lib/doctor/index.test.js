import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

/**
 * Index module tests
 *
 * Tests the barrel export, checkSections structure, and runner functions.
 * Individual check function tests are in the domain test files:
 * - checks/environment/*.test.js
 * - checks/project/*.test.js
 * - checks/outputs/*.test.js
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// Barrel export tests
// ─────────────────────────────────────────────────────────────────────────────

test('checks array exports all check definitions', async (t) => {
  const { checks } = await import('./index.js')

  t.true(Array.isArray(checks))
  t.is(checks.length, 11)

  const checkNames = checks.map((c) => c.name)
  t.true(checkNames.includes('Quire CLI version'))
  t.true(checkNames.includes('Node.js version'))
  t.true(checkNames.includes('npm available'))
  t.true(checkNames.includes('Git available'))
  t.true(checkNames.includes('Quire project detected'))
  t.true(checkNames.includes('Dependencies installed'))
  t.true(checkNames.includes('quire-11ty version'))
  t.true(checkNames.includes('Data files'))
  t.true(checkNames.includes('Build status'))
  t.true(checkNames.includes('PDF output'))
  t.true(checkNames.includes('EPUB output'))

  // Verify each check has a function
  for (const { check } of checks) {
    t.is(typeof check, 'function')
  }
})

test('checkSections exports checks organized by 3 sections', async (t) => {
  const { checkSections } = await import('./index.js')

  t.true(Array.isArray(checkSections))
  t.is(checkSections.length, 3)

  const sectionNames = checkSections.map((s) => s.name)
  t.true(sectionNames.includes('Environment'))
  t.true(sectionNames.includes('Project'))
  t.true(sectionNames.includes('Outputs'))

  // Environment section should have 4 checks
  const envSection = checkSections.find((s) => s.name === 'Environment')
  t.is(envSection.checks.length, 4)
  const envCheckNames = envSection.checks.map((c) => c.name)
  t.true(envCheckNames.includes('Quire CLI version'))
  t.true(envCheckNames.includes('Node.js version'))
  t.true(envCheckNames.includes('npm available'))
  t.true(envCheckNames.includes('Git available'))

  // Project section should have 4 checks
  const projectSection = checkSections.find((s) => s.name === 'Project')
  t.is(projectSection.checks.length, 4)
  const projectCheckNames = projectSection.checks.map((c) => c.name)
  t.true(projectCheckNames.includes('Quire project'))
  t.true(projectCheckNames.includes('Dependencies'))
  t.true(projectCheckNames.includes('quire-11ty version'))
  t.true(projectCheckNames.includes('Data files'))

  // Outputs section should have 3 checks
  const outputsSection = checkSections.find((s) => s.name === 'Outputs')
  t.is(outputsSection.checks.length, 3)
  const outputCheckNames = outputsSection.checks.map((c) => c.name)
  t.true(outputCheckNames.includes('Build status'))
  t.true(outputCheckNames.includes('PDF output'))
  t.true(outputCheckNames.includes('EPUB output'))
})

test('default export includes all expected functions', async (t) => {
  const doctor = await import('./index.js')

  // Runner functions
  t.is(typeof doctor.default.runAllChecks, 'function')
  t.is(typeof doctor.default.runAllChecksWithSections, 'function')

  // Check functions
  t.is(typeof doctor.default.checkCliVersion, 'function')
  t.is(typeof doctor.default.checkNodeVersion, 'function')
  t.is(typeof doctor.default.checkNpmAvailable, 'function')
  t.is(typeof doctor.default.checkGitAvailable, 'function')
  t.is(typeof doctor.default.checkQuireProject, 'function')
  t.is(typeof doctor.default.checkDependencies, 'function')
  t.is(typeof doctor.default.checkOutdatedQuire11ty, 'function')
  t.is(typeof doctor.default.checkDataFiles, 'function')
  t.is(typeof doctor.default.checkStaleBuild, 'function')
  t.is(typeof doctor.default.checkPdfOutput, 'function')
  t.is(typeof doctor.default.checkEpubOutput, 'function')

  // Collections
  t.truthy(doctor.default.checks)
  t.truthy(doctor.default.checkSections)
})

test('named exports match default export', async (t) => {
  const doctor = await import('./index.js')

  t.is(doctor.checkCliVersion, doctor.default.checkCliVersion)
  t.is(doctor.checkNodeVersion, doctor.default.checkNodeVersion)
  t.is(doctor.checkNpmAvailable, doctor.default.checkNpmAvailable)
  t.is(doctor.checkGitAvailable, doctor.default.checkGitAvailable)
  t.is(doctor.checkQuireProject, doctor.default.checkQuireProject)
  t.is(doctor.checkDependencies, doctor.default.checkDependencies)
  t.is(doctor.checkOutdatedQuire11ty, doctor.default.checkOutdatedQuire11ty)
  t.is(doctor.checkDataFiles, doctor.default.checkDataFiles)
  t.is(doctor.checkStaleBuild, doctor.default.checkStaleBuild)
  t.is(doctor.checkPdfOutput, doctor.default.checkPdfOutput)
  t.is(doctor.checkEpubOutput, doctor.default.checkEpubOutput)
  t.is(doctor.runAllChecks, doctor.default.runAllChecks)
  t.is(doctor.runAllChecksWithSections, doctor.default.runAllChecksWithSections)
})

test('constants are exported', async (t) => {
  const doctor = await import('./index.js')

  t.is(doctor.DOCS_BASE_URL, 'https://quire.getty.edu/docs-v1')
  t.is(doctor.REQUIRED_NODE_VERSION, 22)
  t.is(doctor.QUIRE_11TY_PACKAGE, '@thegetty/quire-11ty')
})

// ─────────────────────────────────────────────────────────────────────────────
// Runner function tests
// ─────────────────────────────────────────────────────────────────────────────

test('runAllChecks runs all checks and returns results array', async (t) => {
  const { sandbox } = t.context

  // Create mock check functions
  const mockCheckCli = sandbox.stub().returns({ ok: true, message: 'v1.0.0-rc.33' })
  const mockCheckNode = sandbox.stub().returns({ ok: true, message: 'v22' })
  const mockCheckNpm = sandbox.stub().resolves({ ok: true, message: null })
  const mockCheckGit = sandbox.stub().resolves({ ok: true, message: null })
  const mockCheckProject = sandbox.stub().returns({ ok: true, message: '.quire' })
  const mockCheckDeps = sandbox.stub().returns({ ok: true, message: null })
  const mockCheckQuire11ty = sandbox.stub().resolves({ ok: true, message: 'v1.0.0' })
  const mockCheckData = sandbox.stub().returns({ ok: true, message: '3 files' })
  const mockCheckStale = sandbox.stub().returns({ ok: true, message: 'up to date' })
  const mockCheckPdf = sandbox.stub().returns({ ok: true, message: 'no PDF' })
  const mockCheckEpub = sandbox.stub().returns({ ok: true, message: 'no EPUB' })

  const { runAllChecks } = await esmock('./index.js', {
    './checks/environment/index.js': {
      checkCliVersion: mockCheckCli,
      checkNodeVersion: mockCheckNode,
      checkNpmAvailable: mockCheckNpm,
      checkGitAvailable: mockCheckGit,
    },
    './checks/project/index.js': {
      checkQuireProject: mockCheckProject,
      checkDependencies: mockCheckDeps,
      checkOutdatedQuire11ty: mockCheckQuire11ty,
      checkDataFiles: mockCheckData,
    },
    './checks/outputs/index.js': {
      checkStaleBuild: mockCheckStale,
      checkPdfOutput: mockCheckPdf,
      checkEpubOutput: mockCheckEpub,
    },
  })

  const results = await runAllChecks()

  t.true(Array.isArray(results))
  t.is(results.length, 11)

  // Verify each result has expected shape
  for (const result of results) {
    t.is(typeof result.name, 'string')
    t.is(typeof result.ok, 'boolean')
  }

  // Verify all checks were called
  t.true(mockCheckCli.calledOnce)
  t.true(mockCheckNode.calledOnce)
  t.true(mockCheckNpm.calledOnce)
  t.true(mockCheckGit.calledOnce)
  t.true(mockCheckProject.calledOnce)
  t.true(mockCheckDeps.calledOnce)
  t.true(mockCheckQuire11ty.calledOnce)
  t.true(mockCheckData.calledOnce)
  t.true(mockCheckStale.calledOnce)
  t.true(mockCheckPdf.calledOnce)
  t.true(mockCheckEpub.calledOnce)
})

test('runAllChecksWithSections returns results organized by 3 sections', async (t) => {
  const { sandbox } = t.context

  // Create mock check functions
  const mockCheckCli = sandbox.stub().returns({ ok: true, message: 'v1.0.0-rc.33' })
  const mockCheckNode = sandbox.stub().returns({ ok: true, message: 'v22' })
  const mockCheckNpm = sandbox.stub().resolves({ ok: true, message: null })
  const mockCheckGit = sandbox.stub().resolves({ ok: true, message: null })
  const mockCheckProject = sandbox.stub().returns({ ok: true, message: '.quire' })
  const mockCheckDeps = sandbox.stub().returns({ ok: true, message: null })
  const mockCheckQuire11ty = sandbox.stub().resolves({ ok: true, message: 'v1.0.0' })
  const mockCheckData = sandbox.stub().returns({ ok: true, message: '3 files' })
  const mockCheckStale = sandbox.stub().returns({ ok: true, message: 'up to date' })
  const mockCheckPdf = sandbox.stub().returns({ ok: true, message: 'no PDF' })
  const mockCheckEpub = sandbox.stub().returns({ ok: true, message: 'no EPUB' })

  const { runAllChecksWithSections } = await esmock('./index.js', {
    './checks/environment/index.js': {
      checkCliVersion: mockCheckCli,
      checkNodeVersion: mockCheckNode,
      checkNpmAvailable: mockCheckNpm,
      checkGitAvailable: mockCheckGit,
    },
    './checks/project/index.js': {
      checkQuireProject: mockCheckProject,
      checkDependencies: mockCheckDeps,
      checkOutdatedQuire11ty: mockCheckQuire11ty,
      checkDataFiles: mockCheckData,
    },
    './checks/outputs/index.js': {
      checkStaleBuild: mockCheckStale,
      checkPdfOutput: mockCheckPdf,
      checkEpubOutput: mockCheckEpub,
    },
  })

  const sections = await runAllChecksWithSections()

  t.true(Array.isArray(sections))
  t.is(sections.length, 3)

  // Verify section structure
  const sectionNames = sections.map((s) => s.section)
  t.deepEqual(sectionNames, ['Environment', 'Project', 'Outputs'])

  // Verify each section has results
  for (const { section, results } of sections) {
    t.is(typeof section, 'string')
    t.true(Array.isArray(results))
    for (const result of results) {
      t.is(typeof result.name, 'string')
      t.is(typeof result.ok, 'boolean')
    }
  }

  // Verify section sizes
  const envSection = sections.find((s) => s.section === 'Environment')
  t.is(envSection.results.length, 4)

  const projectSection = sections.find((s) => s.section === 'Project')
  t.is(projectSection.results.length, 4)

  const outputsSection = sections.find((s) => s.section === 'Outputs')
  t.is(outputsSection.results.length, 3)
})

test('runAllChecks handles async checks correctly', async (t) => {
  const { sandbox } = t.context

  // Mix of sync and async checks
  const mockSyncCheck = sandbox.stub().returns({ ok: true, message: 'sync' })
  const mockAsyncCheck = sandbox.stub().resolves({ ok: false, level: 'warn', message: 'async' })

  const { runAllChecks } = await esmock('./index.js', {
    './checks/environment/index.js': {
      checkCliVersion: mockSyncCheck,
      checkNodeVersion: mockSyncCheck,
      checkNpmAvailable: mockAsyncCheck,
      checkGitAvailable: mockAsyncCheck,
    },
    './checks/project/index.js': {
      checkQuireProject: mockSyncCheck,
      checkDependencies: mockSyncCheck,
      checkOutdatedQuire11ty: mockAsyncCheck,
      checkDataFiles: mockSyncCheck,
    },
    './checks/outputs/index.js': {
      checkStaleBuild: mockSyncCheck,
      checkPdfOutput: mockSyncCheck,
      checkEpubOutput: mockSyncCheck,
    },
  })

  const results = await runAllChecks()

  t.is(results.length, 11)

  // Verify async results are properly awaited
  const asyncResults = results.filter((r) => r.message === 'async')
  t.is(asyncResults.length, 3)
  for (const result of asyncResults) {
    t.false(result.ok)
    t.is(result.level, 'warn')
  }
})

test('runAllChecks preserves all check result properties', async (t) => {
  const { sandbox } = t.context

  const fullResult = {
    ok: false,
    level: 'warn',
    message: 'Test message',
    remediation: 'Fix steps',
    docsUrl: 'https://example.com',
  }

  const { runAllChecks } = await esmock('./index.js', {
    './checks/environment/index.js': {
      checkCliVersion: sandbox.stub().returns(fullResult),
      checkNodeVersion: sandbox.stub().returns({ ok: true, message: null }),
      checkNpmAvailable: sandbox.stub().resolves({ ok: true, message: null }),
      checkGitAvailable: sandbox.stub().resolves({ ok: true, message: null }),
    },
    './checks/project/index.js': {
      checkQuireProject: sandbox.stub().returns({ ok: true, message: null }),
      checkDependencies: sandbox.stub().returns({ ok: true, message: null }),
      checkOutdatedQuire11ty: sandbox.stub().resolves({ ok: true, message: null }),
      checkDataFiles: sandbox.stub().returns({ ok: true, message: null }),
    },
    './checks/outputs/index.js': {
      checkStaleBuild: sandbox.stub().returns({ ok: true, message: null }),
      checkPdfOutput: sandbox.stub().returns({ ok: true, message: null }),
      checkEpubOutput: sandbox.stub().returns({ ok: true, message: null }),
    },
  })

  const results = await runAllChecks()
  const cliResult = results.find((r) => r.name === 'Quire CLI version')

  t.false(cliResult.ok)
  t.is(cliResult.level, 'warn')
  t.is(cliResult.message, 'Test message')
  t.is(cliResult.remediation, 'Fix steps')
  t.is(cliResult.docsUrl, 'https://example.com')
})
