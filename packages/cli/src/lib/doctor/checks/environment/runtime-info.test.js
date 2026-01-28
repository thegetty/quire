import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkRuntimeInfo returns ok with heap limit', async (t) => {
  const { sandbox } = t.context

  const { checkRuntimeInfo } = await esmock('./runtime-info.js', {
    'node:v8': {
      getHeapStatistics: sandbox.stub().returns({
        heap_size_limit: 4 * 1024 * 1024 * 1024, // 4 GB
      }),
    },
    '#lib/platform.js': {
      getPlatform: sandbox.stub().returns('macos'),
      Platform: { MACOS: 'macos', WINDOWS: 'windows', LINUX: 'linux' },
    },
  })

  const result = checkRuntimeInfo()

  t.true(result.ok)
  t.regex(result.message, /Heap limit: 4096 MB/)
  t.is(typeof result.details, 'string')
})

test('checkRuntimeInfo includes NODE_OPTIONS in details', async (t) => {
  const { sandbox } = t.context

  const { checkRuntimeInfo } = await esmock('./runtime-info.js', {
    'node:v8': {
      getHeapStatistics: sandbox.stub().returns({
        heap_size_limit: 8 * 1024 * 1024 * 1024,
      }),
    },
    '#lib/platform.js': {
      getPlatform: sandbox.stub().returns('macos'),
      Platform: { MACOS: 'macos', WINDOWS: 'windows', LINUX: 'linux' },
    },
  })

  const result = checkRuntimeInfo()

  // NODE_OPTIONS should appear in details (either the actual value or '(not set)')
  t.true(result.details.includes('NODE_OPTIONS:'))
  t.true(result.details.includes('Shell:'))
  t.true(result.details.includes('Locale:'))
})

test('checkRuntimeInfo shows (not set) for missing env vars', async (t) => {
  const { sandbox } = t.context

  const originalNodeOptions = process.env.NODE_OPTIONS
  const originalShell = process.env.SHELL
  const originalLang = process.env.LANG
  const originalLcAll = process.env.LC_ALL

  delete process.env.NODE_OPTIONS
  delete process.env.SHELL
  delete process.env.LANG
  delete process.env.LC_ALL

  try {
    const { checkRuntimeInfo } = await esmock('./runtime-info.js', {
      'node:v8': {
        getHeapStatistics: sandbox.stub().returns({
          heap_size_limit: 4 * 1024 * 1024 * 1024,
        }),
      },
      '#lib/platform.js': {
        getPlatform: sandbox.stub().returns('linux'),
        Platform: { MACOS: 'macos', WINDOWS: 'windows', LINUX: 'linux' },
      },
    })

    const result = checkRuntimeInfo()

    t.true(result.details.includes('NODE_OPTIONS: (not set)'))
    t.true(result.details.includes('Shell: (not set)'))
    t.true(result.details.includes('Locale: (not set)'))
  } finally {
    if (originalNodeOptions !== undefined) process.env.NODE_OPTIONS = originalNodeOptions
    if (originalShell !== undefined) process.env.SHELL = originalShell
    if (originalLang !== undefined) process.env.LANG = originalLang
    if (originalLcAll !== undefined) process.env.LC_ALL = originalLcAll
  }
})

test('checkRuntimeInfo uses COMSPEC on Windows', async (t) => {
  const { sandbox } = t.context

  const originalShell = process.env.SHELL
  const originalComspec = process.env.COMSPEC

  delete process.env.SHELL
  process.env.COMSPEC = 'C:\\Windows\\System32\\cmd.exe'

  try {
    const { checkRuntimeInfo } = await esmock('./runtime-info.js', {
      'node:v8': {
        getHeapStatistics: sandbox.stub().returns({
          heap_size_limit: 4 * 1024 * 1024 * 1024,
        }),
      },
      '#lib/platform.js': {
        getPlatform: sandbox.stub().returns('windows'),
        Platform: { MACOS: 'macos', WINDOWS: 'windows', LINUX: 'linux' },
      },
    })

    const result = checkRuntimeInfo()

    t.true(result.details.includes('Shell: C:\\Windows\\System32\\cmd.exe'))
  } finally {
    if (originalShell !== undefined) {
      process.env.SHELL = originalShell
    }
    if (originalComspec !== undefined) {
      process.env.COMSPEC = originalComspec
    } else {
      delete process.env.COMSPEC
    }
  }
})
