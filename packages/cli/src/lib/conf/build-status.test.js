import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * Build Status Module Tests
 *
 * Tests the per-project build status persistence API.
 * Mocks the config module with a simple in-memory store.
 */

test.beforeEach(async (t) => {
  const sandbox = sinon.createSandbox()

  // In-memory store that mimics config.get/set for 'projects'
  const store = {}
  const configMock = {
    default: {
      get: sandbox.stub().callsFake((key) => store[key]),
      set: sandbox.stub().callsFake((key, value) => { store[key] = value }),
    },
  }

  const mod = await esmock('./build-status.js', {
    '#lib/conf/config.js': configMock,
  })

  t.context = { sandbox, store, configMock, ...mod }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// ─────────────────────────────────────────────────────────────────────────────
// projectKey
// ─────────────────────────────────────────────────────────────────────────────

test('projectKey returns a 12-character hex string', (t) => {
  const { projectKey } = t.context
  const key = projectKey('/Users/test/my-project')
  t.is(key.length, 12)
  t.regex(key, /^[0-9a-f]{12}$/)
})

test('projectKey returns the same key for the same path', (t) => {
  const { projectKey } = t.context
  const key1 = projectKey('/Users/test/my-project')
  const key2 = projectKey('/Users/test/my-project')
  t.is(key1, key2)
})

test('projectKey returns different keys for different paths', (t) => {
  const { projectKey } = t.context
  const key1 = projectKey('/Users/test/project-a')
  const key2 = projectKey('/Users/test/project-b')
  t.not(key1, key2)
})

// ─────────────────────────────────────────────────────────────────────────────
// recordStatus
// ─────────────────────────────────────────────────────────────────────────────

test('recordStatus writes status with timestamp to config', (t) => {
  const { recordStatus, projectKey, configMock } = t.context
  const projectPath = '/Users/test/my-project'

  recordStatus(projectPath, 'build', 'ok')

  t.true(configMock.default.set.calledOnce)
  const [setKey, setValue] = configMock.default.set.firstCall.args
  t.is(setKey, 'projects')

  const key = projectKey(projectPath)
  const entry = setValue[key]
  t.is(entry.projectPath, projectPath)
  t.is(entry.buildStatus.build.status, 'ok')
  t.is(typeof entry.buildStatus.build.timestamp, 'number')
})

test('recordStatus records failed status', (t) => {
  const { recordStatus, projectKey, configMock } = t.context
  const projectPath = '/Users/test/my-project'

  recordStatus(projectPath, 'pdf', 'failed')

  const [, setValue] = configMock.default.set.firstCall.args
  const key = projectKey(projectPath)
  t.is(setValue[key].buildStatus.pdf.status, 'failed')
})

test('recordStatus silently ignores untracked commands', (t) => {
  const { recordStatus, configMock } = t.context

  recordStatus('/Users/test/my-project', 'preview', 'ok')

  t.false(configMock.default.set.called)
})

test('recordStatus preserves existing command entries', (t) => {
  const { recordStatus, projectKey, store } = t.context
  const projectPath = '/Users/test/my-project'
  const key = projectKey(projectPath)

  // Pre-populate with a build entry
  store.projects = {
    [key]: {
      projectPath,
      buildStatus: {
        build: { status: 'ok', timestamp: 1000 },
      },
    },
  }

  recordStatus(projectPath, 'pdf', 'failed')

  const entry = store.projects[key]
  t.is(entry.buildStatus.build.status, 'ok')
  t.is(entry.buildStatus.build.timestamp, 1000)
  t.is(entry.buildStatus.pdf.status, 'failed')
})

// ─────────────────────────────────────────────────────────────────────────────
// getStatus
// ─────────────────────────────────────────────────────────────────────────────

test('getStatus returns stored status entry', (t) => {
  const { getStatus, projectKey, store } = t.context
  const projectPath = '/Users/test/my-project'
  const key = projectKey(projectPath)

  store.projects = {
    [key]: {
      projectPath,
      buildStatus: {
        build: { status: 'ok', timestamp: 1000 },
      },
    },
  }

  const result = getStatus(projectPath, 'build')
  t.deepEqual(result, { status: 'ok', timestamp: 1000 })
})

test('getStatus returns undefined for unknown project', (t) => {
  const { getStatus } = t.context

  const result = getStatus('/Users/test/unknown-project', 'build')
  t.is(result, undefined)
})

test('getStatus returns undefined for unrecorded command', (t) => {
  const { getStatus, projectKey, store } = t.context
  const projectPath = '/Users/test/my-project'
  const key = projectKey(projectPath)

  store.projects = {
    [key]: {
      projectPath,
      buildStatus: {
        build: { status: 'ok', timestamp: 1000 },
      },
    },
  }

  const result = getStatus(projectPath, 'epub')
  t.is(result, undefined)
})

// ─────────────────────────────────────────────────────────────────────────────
// clearStatus
// ─────────────────────────────────────────────────────────────────────────────

test('clearStatus removes project entry', (t) => {
  const { clearStatus, projectKey, store, configMock } = t.context
  const projectPath = '/Users/test/my-project'
  const key = projectKey(projectPath)

  store.projects = {
    [key]: {
      projectPath,
      buildStatus: {
        build: { status: 'ok', timestamp: 1000 },
      },
    },
  }

  clearStatus(projectPath)

  const [, setValue] = configMock.default.set.firstCall.args
  t.truthy(setValue[key], 'project entry should still exist')
  t.is(setValue[key].projectPath, projectPath, 'projectPath should be preserved')
  t.is(setValue[key].buildStatus, undefined, 'buildStatus should be removed')
})

test('clearStatus is a no-op for unknown project', (t) => {
  const { clearStatus, configMock, store } = t.context

  store.projects = {}
  clearStatus('/Users/test/unknown-project')

  t.false(configMock.default.set.called)
})

test('clearStatus is a no-op when project has no buildStatus', (t) => {
  const { clearStatus, projectKey, configMock, store } = t.context
  const projectPath = '/Users/test/my-project'
  const key = projectKey(projectPath)

  store.projects = {
    [key]: { projectPath },
  }

  clearStatus(projectPath)

  t.false(configMock.default.set.called)
})

// ─────────────────────────────────────────────────────────────────────────────
// Multiple projects
// ─────────────────────────────────────────────────────────────────────────────

test('multiple projects are tracked independently', (t) => {
  const { recordStatus, getStatus } = t.context
  const projectA = '/Users/test/project-a'
  const projectB = '/Users/test/project-b'

  recordStatus(projectA, 'build', 'ok')
  recordStatus(projectB, 'build', 'failed')

  t.is(getStatus(projectA, 'build').status, 'ok')
  t.is(getStatus(projectB, 'build').status, 'failed')
})

// ─────────────────────────────────────────────────────────────────────────────
// TRACKED_COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

test('TRACKED_COMMANDS contains build, pdf, and epub', (t) => {
  const { TRACKED_COMMANDS } = t.context
  t.deepEqual([...TRACKED_COMMANDS], ['build', 'pdf', 'epub'])
})

test('TRACKED_COMMANDS is frozen', (t) => {
  const { TRACKED_COMMANDS } = t.context
  t.true(Object.isFrozen(TRACKED_COMMANDS))
})
