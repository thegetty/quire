import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkCliVersion returns ok with version when up to date', async (t) => {
  const { sandbox } = t.context

  const mockUpdateNotifier = sandbox.stub().returns({
    update: { current: '1.0.0-rc.33', latest: '1.0.0-rc.33', type: 'latest' },
  })

  const { checkCliVersion } = await esmock('./cli-version.js', {
    'update-notifier': { default: mockUpdateNotifier },
    '#src/packageConfig.js': { default: { name: '@thegetty/quire-cli', version: '1.0.0-rc.33' } },
    '#lib/conf/config.js': { default: { get: sandbox.stub().returns('rc') } },
  })

  const result = checkCliVersion()

  t.true(result.ok)
  t.regex(result.message, /v1\.0\.0-rc\.33/)
  t.regex(result.message, /up to date/)
})

test('checkCliVersion returns warning when update is available', async (t) => {
  const { sandbox } = t.context

  const mockUpdateNotifier = sandbox.stub().returns({
    update: { current: '1.0.0-rc.30', latest: '1.0.0-rc.33', type: 'prerelease' },
  })

  const { checkCliVersion } = await esmock('./cli-version.js', {
    'update-notifier': { default: mockUpdateNotifier },
    '#src/packageConfig.js': { default: { name: '@thegetty/quire-cli', version: '1.0.0-rc.30' } },
    '#lib/conf/config.js': { default: { get: sandbox.stub().returns('rc') } },
  })

  const result = checkCliVersion()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /v1\.0\.0-rc\.30 installed/)
  t.regex(result.message, /v1\.0\.0-rc\.33 available/)
  t.truthy(result.remediation)
  t.regex(result.remediation, /npm install/)
  t.truthy(result.docsUrl)
})

test('checkCliVersion returns ok without "up to date" when no cached update info', async (t) => {
  const { sandbox } = t.context

  // No cached update info (first run or cache cleared)
  const mockUpdateNotifier = sandbox.stub().returns({
    update: undefined,
  })

  const { checkCliVersion } = await esmock('./cli-version.js', {
    'update-notifier': { default: mockUpdateNotifier },
    '#src/packageConfig.js': { default: { name: '@thegetty/quire-cli', version: '1.0.0-rc.33' } },
    '#lib/conf/config.js': { default: { get: sandbox.stub().returns('rc') } },
  })

  const result = checkCliVersion()

  t.true(result.ok)
  t.is(result.message, 'v1.0.0-rc.33')
  t.notRegex(result.message, /up to date/)
})

test('checkCliVersion uses configured updateChannel', async (t) => {
  const { sandbox } = t.context

  const mockUpdateNotifier = sandbox.stub().returns({ update: undefined })
  const mockConfigGet = sandbox.stub().returns('latest')

  const { checkCliVersion } = await esmock('./cli-version.js', {
    'update-notifier': { default: mockUpdateNotifier },
    '#src/packageConfig.js': { default: { name: '@thegetty/quire-cli', version: '1.0.0' } },
    '#lib/conf/config.js': { default: { get: mockConfigGet } },
  })

  checkCliVersion()

  t.true(mockUpdateNotifier.calledOnce)
  const callArgs = mockUpdateNotifier.firstCall.args[0]
  t.is(callArgs.distTag, 'latest')
})

test('checkCliVersion defaults to rc channel when config returns undefined', async (t) => {
  const { sandbox } = t.context

  const mockUpdateNotifier = sandbox.stub().returns({ update: undefined })
  const mockConfigGet = sandbox.stub().returns(undefined)

  const { checkCliVersion } = await esmock('./cli-version.js', {
    'update-notifier': { default: mockUpdateNotifier },
    '#src/packageConfig.js': { default: { name: '@thegetty/quire-cli', version: '1.0.0' } },
    '#lib/conf/config.js': { default: { get: mockConfigGet } },
  })

  checkCliVersion()

  t.true(mockUpdateNotifier.calledOnce)
  const callArgs = mockUpdateNotifier.firstCall.args[0]
  t.is(callArgs.distTag, 'rc')
})

test('checkCliVersion remediation includes latest version number', async (t) => {
  const { sandbox } = t.context

  const mockUpdateNotifier = sandbox.stub().returns({
    update: { current: '1.0.0-rc.30', latest: '1.0.0-rc.35', type: 'prerelease' },
  })

  const { checkCliVersion } = await esmock('./cli-version.js', {
    'update-notifier': { default: mockUpdateNotifier },
    '#src/packageConfig.js': { default: { name: '@thegetty/quire-cli', version: '1.0.0-rc.30' } },
    '#lib/conf/config.js': { default: { get: sandbox.stub().returns('rc') } },
  })

  const result = checkCliVersion()

  t.regex(result.remediation, /@thegetty\/quire-cli@1\.0\.0-rc\.35/)
})
