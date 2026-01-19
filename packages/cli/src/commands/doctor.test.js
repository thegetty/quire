import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()

  // Create mock logger
  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
  }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('doctor command should run all diagnostic checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockResults = [
    { name: 'Node.js version', ok: true, message: 'v22.0.0' },
    { name: 'npm available', ok: true, message: null },
    { name: 'Git available', ok: true, message: null },
    { name: 'Quire project detected', ok: true, message: 'Detected via .quire' },
    { name: 'Dependencies installed', ok: true, message: null },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecks: sandbox.stub().resolves(mockResults),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  t.true(mockLogger.info.called, 'should log info messages')
  t.true(
    mockLogger.info.calledWith(sinon.match(/Running diagnostic checks/)),
    'should log diagnostic header'
  )
})

test('doctor command should report failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockResults = [
    { name: 'Node.js version', ok: true, message: 'v22.0.0' },
    {
      name: 'npm available',
      ok: false,
      message: 'npm not found in PATH',
      remediation: 'Install Node.js to get npm',
      docsUrl: 'https://quire.getty.edu/docs-v1/install-uninstall/',
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecks: sandbox.stub().resolves(mockResults),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  t.true(mockLogger.error.called, 'should log error for failed check')
  t.true(
    mockLogger.warn.calledWith(sinon.match(/Some checks failed/)),
    'should warn about failures'
  )
})

test('doctor command should display remediation guidance for failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockResults = [
    {
      name: 'npm available',
      ok: false,
      message: 'npm not found in PATH',
      remediation: 'Install Node.js to get npm',
      docsUrl: 'https://quire.getty.edu/docs-v1/install-uninstall/',
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecks: sandbox.stub().resolves(mockResults),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // Failed checks output goes through logger.error as a single joined string
  t.true(
    mockLogger.error.calledWith(sinon.match(/How to fix/)),
    'should display "How to fix" header'
  )
  t.true(
    mockLogger.error.calledWith(sinon.match(/Install Node.js/)),
    'should display remediation text'
  )
  t.true(
    mockLogger.error.calledWith(sinon.match(/Documentation:/)),
    'should display documentation label'
  )
  t.true(
    mockLogger.error.calledWith(sinon.match(/quire\.getty\.edu/)),
    'should display documentation URL'
  )
})

test('doctor command should report all checks passed when healthy', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockResults = [
    { name: 'Node.js version', ok: true, message: 'v22.0.0' },
    { name: 'npm available', ok: true, message: null },
    { name: 'Git available', ok: true, message: null },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecks: sandbox.stub().resolves(mockResults),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  t.true(
    mockLogger.info.calledWith(sinon.match(/All checks passed/)),
    'should report all checks passed'
  )
})

test('doctor command should display check messages', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockResults = [
    { name: 'Node.js version', ok: true, message: 'v22.0.0 (>= 22 required)' },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecks: sandbox.stub().resolves(mockResults),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // Should display the message
  t.true(
    mockLogger.info.calledWith(sinon.match(/v22\.0\.0/)),
    'should display check message'
  )
})
