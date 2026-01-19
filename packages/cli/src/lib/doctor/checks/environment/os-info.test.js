import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkOsInfo returns ok with platform info', async (t) => {
  const { sandbox } = t.context

  const { checkOsInfo } = await esmock('./os-info.js', {
    '#lib/platform.js': {
      getPlatform: sandbox.stub().returns('macos'),
      getPlatformName: sandbox.stub().returns('macOS 14'),
      Platform: { MACOS: 'macos', WINDOWS: 'windows', LINUX: 'linux' },
    },
    'node:os': {
      arch: sandbox.stub().returns('arm64'),
    },
  })

  const result = checkOsInfo()

  t.true(result.ok)
  t.regex(result.message, /macOS 14/)
  t.regex(result.message, /arm64/)
})

test('checkOsInfo adds Windows note on Windows', async (t) => {
  const { sandbox } = t.context

  const { checkOsInfo } = await esmock('./os-info.js', {
    '#lib/platform.js': {
      getPlatform: sandbox.stub().returns('windows'),
      getPlatformName: sandbox.stub().returns('Windows (10.0.22621)'),
      Platform: { MACOS: 'macos', WINDOWS: 'windows', LINUX: 'linux' },
    },
    'node:os': {
      arch: sandbox.stub().returns('x64'),
    },
  })

  const result = checkOsInfo()

  t.true(result.ok)
  t.regex(result.message, /Windows/)
  t.regex(result.message, /Git for Windows/)
})

test('checkOsInfo works on Linux', async (t) => {
  const { sandbox } = t.context

  const { checkOsInfo } = await esmock('./os-info.js', {
    '#lib/platform.js': {
      getPlatform: sandbox.stub().returns('linux'),
      getPlatformName: sandbox.stub().returns('Linux (5.15.0)'),
      Platform: { MACOS: 'macos', WINDOWS: 'windows', LINUX: 'linux' },
    },
    'node:os': {
      arch: sandbox.stub().returns('x64'),
    },
  })

  const result = checkOsInfo()

  t.true(result.ok)
  t.regex(result.message, /Linux/)
  t.notRegex(result.message, /Git for Windows/)
})
