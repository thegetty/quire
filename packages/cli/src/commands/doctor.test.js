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

/**
 * Helper to create a DoctorCommand with mocked dependencies
 */
async function createMockedDoctorCommand(sandbox, mockSections) {
  return esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
      checkSections: [],
      SECTION_NAMES: ['environment', 'project', 'outputs'],
      CHECK_IDS: ['os', 'cli', 'node', 'npm', 'git', 'project', 'deps', '11ty', 'data', 'build', 'pdf', 'epub'],
    },
  })
}

test('doctor command should run all diagnostic checks with sections', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'Node.js version', ok: true, message: 'v22.0.0' },
        { name: 'npm available', ok: true, message: null },
        { name: 'Git available', ok: true, message: null },
      ],
    },
    {
      section: 'Project',
      results: [
        { name: 'Quire project', ok: true, message: 'Detected via .quire' },
        { name: 'Dependencies', ok: true, message: null },
        { name: 'Build status', ok: true, message: 'Build output is up to date' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
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
  t.true(
    mockLogger.info.calledWith('Environment'),
    'should display Environment section header'
  )
  t.true(
    mockLogger.info.calledWith('Project'),
    'should display Project section header'
  )
})

test('doctor command should report failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'Node.js version', ok: true, message: 'v22.0.0' },
        {
          name: 'npm available',
          ok: false,
          message: 'npm not found in PATH',
          remediation: 'Install Node.js to get npm',
          docsUrl: 'https://quire.getty.edu/docs-v1/install-uninstall/',
        },
      ],
    },
  ]

  const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  t.true(mockLogger.error.called, 'should log error for failed check')
  t.true(
    mockLogger.error.calledWith(sinon.match(/1 check failed/)),
    'should report failure count'
  )
})

test('doctor command should display remediation guidance for failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        {
          name: 'npm available',
          ok: false,
          message: 'npm not found in PATH',
          remediation: 'Install Node.js to get npm',
          docsUrl: 'https://quire.getty.edu/docs-v1/install-uninstall/',
        },
      ],
    },
  ]

  const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

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

test('doctor command should display warnings with warning indicator', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Project',
      results: [
        {
          name: 'Build status',
          ok: false,
          level: 'warn',
          message: 'Build output is 1 hour older than source files',
          remediation: 'Run quire build to regenerate',
        },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // Warnings go through logger.warn
  t.true(mockLogger.warn.called, 'should log warning for warn-level check')
  t.true(
    mockLogger.warn.calledWith(sinon.match(/⚠/)),
    'should display warning indicator'
  )
  t.true(
    mockLogger.warn.calledWith(sinon.match(/All checks passed with 1 warning/)),
    'should report passed with warning count'
  )
})

test('doctor command should report all checks passed when healthy', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'Node.js version', ok: true, message: 'v22.0.0' },
        { name: 'npm available', ok: true, message: null },
        { name: 'Git available', ok: true, message: null },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
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

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'Node.js version', ok: true, message: 'v22.0.0 (>= 22 required)' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
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

// ─────────────────────────────────────────────────────────────────────────────
// Exit code tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('doctor command should set exitCode 1 when checks fail', async (t) => {
  const { sandbox, mockLogger } = t.context

  const savedExitCode = process.exitCode

  try {
    const mockSections = [
      {
        section: 'Environment',
        results: [
          {
            name: 'npm available',
            ok: false,
            message: 'npm not found in PATH',
            remediation: 'Install Node.js to get npm',
          },
        ],
      },
    ]

    const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

    const command = new DoctorCommand()
    command.logger = mockLogger

    await command.action({}, command)

    t.is(process.exitCode, 1, 'should set process.exitCode to 1')
  } finally {
    process.exitCode = savedExitCode
  }
})

test.serial('doctor command should not set exitCode when all checks pass', async (t) => {
  const { sandbox, mockLogger } = t.context

  const savedExitCode = process.exitCode
  process.exitCode = undefined

  try {
    const mockSections = [
      {
        section: 'Environment',
        results: [
          { name: 'Node.js version', ok: true, message: 'v22.0.0' },
          { name: 'npm available', ok: true, message: null },
        ],
      },
    ]

    const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

    const command = new DoctorCommand()
    command.logger = mockLogger

    await command.action({}, command)

    t.is(process.exitCode, undefined, 'should not set process.exitCode on success')
  } finally {
    process.exitCode = savedExitCode
  }
})

test.serial('doctor command should not set exitCode when only warnings exist', async (t) => {
  const { sandbox, mockLogger } = t.context

  const savedExitCode = process.exitCode
  process.exitCode = undefined

  try {
    const mockSections = [
      {
        section: 'Project',
        results: [
          {
            name: 'Build status',
            ok: false,
            level: 'warn',
            message: 'Build output is stale',
            remediation: 'Run quire build',
          },
        ],
      },
    ]

    const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

    const command = new DoctorCommand()
    command.logger = mockLogger

    await command.action({}, command)

    t.is(process.exitCode, undefined, 'should not set process.exitCode for warnings')
    t.true(
      mockLogger.warn.calledWith(sinon.match(/All checks passed with 1 warning/)),
      'should report passed with warning count'
    )
  } finally {
    process.exitCode = savedExitCode
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Summary count tests
// ─────────────────────────────────────────────────────────────────────────────

test('doctor command should display plural error count', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'npm', ok: false, message: 'not found' },
        { name: 'Git', ok: false, message: 'not found' },
      ],
    },
  ]

  const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  t.true(
    mockLogger.error.calledWith(sinon.match(/2 checks failed/)),
    'should use plural for multiple errors'
  )
})

test('doctor command should display errors and warnings together', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'npm', ok: false, message: 'not found' },
        { name: 'Git', ok: false, level: 'warn', message: 'outdated' },
        { name: 'Prince', ok: false, level: 'warn', message: 'not found' },
      ],
    },
  ]

  const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  t.true(
    mockLogger.error.calledWith(sinon.match(/1 check failed, 2 warnings/)),
    'should display both error and warning counts'
  )
})

test('doctor command should display plural warning count', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Project',
      results: [
        { name: 'Build', ok: false, level: 'warn', message: 'stale' },
        { name: 'PDF', ok: false, level: 'warn', message: 'stale' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  t.true(
    mockLogger.warn.calledWith(sinon.match(/All checks passed with 2 warnings/)),
    'should use plural for multiple warnings'
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// N/A (not applicable) state tests
// ─────────────────────────────────────────────────────────────────────────────

test('doctor command should display N/A checks with open circle indicator', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Outputs',
      results: [
        {
          name: 'Build status',
          ok: true,
          level: 'na',
          message: 'No build output yet (run quire build)',
        },
        {
          name: 'PDF output',
          ok: true,
          level: 'na',
          message: 'No PDF output (run quire pdf to generate)',
        },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // N/A checks should use ○ indicator
  t.true(
    mockLogger.info.calledWith(sinon.match(/○/)),
    'should display open circle indicator for N/A checks'
  )
})

test('doctor command should not count N/A checks in summary', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Outputs',
      results: [
        { name: 'Build status', ok: true, level: 'na', message: 'No build output' },
        { name: 'PDF output', ok: true, level: 'na', message: 'No PDF output' },
        { name: 'EPUB output', ok: true, level: 'na', message: 'No EPUB output' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // Should report all checks passed (N/A checks don't count as failures)
  t.true(
    mockLogger.info.calledWith(sinon.match(/All checks passed/)),
    'should report all checks passed when only N/A checks exist'
  )
})

test('doctor command should not count N/A checks when mixed with errors', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'npm', ok: false, message: 'not found' },
      ],
    },
    {
      section: 'Outputs',
      results: [
        { name: 'Build status', ok: true, level: 'na', message: 'No build output' },
        { name: 'PDF output', ok: true, level: 'na', message: 'No PDF output' },
      ],
    },
  ]

  const DoctorCommand = await createMockedDoctorCommand(sandbox, mockSections)

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // Should only report 1 error (N/A checks not counted)
  t.true(
    mockLogger.error.calledWith(sinon.match(/1 check failed/)),
    'should only count actual errors, not N/A checks'
  )
})

test('doctor command should use info logger for N/A checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Outputs',
      results: [
        { name: 'PDF output', ok: true, level: 'na', message: 'No PDF output' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // N/A should go through info, not warn or error
  const infoCalls = mockLogger.info.getCalls().map((call) => call.args[0])
  const hasNaInInfo = infoCalls.some((arg) => arg && arg.includes('○') && arg.includes('PDF output'))
  t.true(hasNaInInfo, 'N/A checks should be logged via info')
})

// ─────────────────────────────────────────────────────────────────────────────
// Verbose flag tests
// ─────────────────────────────────────────────────────────────────────────────

test('doctor command should display details when --verbose is passed', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'npm', ok: true, message: '10.2.4', details: '/usr/local/bin/npm' },
        { name: 'Git', ok: true, message: '2.43.0', details: '/usr/bin/git' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ verbose: true }, command)

  // Should display details for each check
  t.true(
    mockLogger.info.calledWith(sinon.match(/\/usr\/local\/bin\/npm/)),
    'should display npm path in verbose mode'
  )
  t.true(
    mockLogger.info.calledWith(sinon.match(/\/usr\/bin\/git/)),
    'should display git path in verbose mode'
  )
})

test('doctor command should not display details when --verbose is not passed', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'npm', ok: true, message: '10.2.4', details: '/usr/local/bin/npm' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  // Should not display details path
  const allCalls = mockLogger.info.getCalls().map((call) => call.args[0])
  const hasPathInOutput = allCalls.some((arg) => arg && arg.includes('/usr/local/bin/npm'))
  t.false(hasPathInOutput, 'should not display npm path without verbose flag')
})

test('doctor command should handle checks without details in verbose mode', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'Node.js version', ok: true, message: 'v22.0.0' }, // no details field
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  // Should not throw when details is undefined
  await t.notThrowsAsync(async () => {
    await command.action({ verbose: true }, command)
  })

  t.true(mockLogger.info.calledWith(sinon.match(/v22\.0\.0/)), 'should still display message')
})

test('doctor command should display symbol key in verbose mode', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ verbose: true }, command)

  t.true(
    mockLogger.info.calledWith(sinon.match(/Key:.*✓.*passed.*✗.*failed.*⚠.*warning.*○.*not applicable.*not yet generated/)),
    'should display symbol key in verbose mode'
  )
})

test('doctor command should not display symbol key without verbose flag', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({}, command)

  const allCalls = mockLogger.info.getCalls().map((call) => call.args[0])
  const hasKey = allCalls.some((arg) => arg && arg.includes('Key:'))
  t.false(hasKey, 'should not display symbol key without verbose flag')
})

// ─────────────────────────────────────────────────────────────────────────────
// JSON output tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('doctor command should output valid JSON when --json flag is used', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
        { id: 'npm', name: 'npm', ok: true, message: '10.2.4', details: '/usr/local/bin/npm' },
      ],
    },
  ]

  // Capture console.log output
  const consoleLogStub = sandbox.stub(console, 'log')

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ json: true }, command)

  // Should call console.log with JSON
  t.true(consoleLogStub.calledOnce, 'should call console.log once')

  const output = consoleLogStub.firstCall.args[0]
  const parsed = JSON.parse(output)

  t.truthy(parsed.summary, 'should have summary object')
  t.is(parsed.summary.passed, 2, 'should count passed checks')
  t.is(parsed.summary.failed, 0, 'should count failed checks')
  t.truthy(parsed.checks, 'should have checks array')
  t.is(parsed.checks.length, 2, 'should include all checks')
  t.is(parsed.checks[0].id, 'node', 'check should have id')
  t.is(parsed.checks[0].status, 'passed', 'check should have status')
})

test.serial('doctor command JSON output should set exitCode 1 when checks fail', async (t) => {
  const { sandbox, mockLogger } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')
  const savedExitCode = process.exitCode

  try {
    const mockSections = [
      {
        section: 'Environment',
        results: [
          { id: 'node', name: 'Node.js version', ok: false, message: 'v18.0.0 found' },
        ],
      },
    ]

    const DoctorCommand = await esmock('./doctor.js', {
      '#lib/doctor/index.js': {
        runAllChecksWithSections: sandbox.stub().resolves(mockSections),
      },
    })

    const command = new DoctorCommand()
    command.logger = mockLogger

    await command.action({ json: true }, command)

    t.is(process.exitCode, 1, 'should set process.exitCode to 1')

    const output = consoleLogStub.firstCall.args[0]
    const parsed = JSON.parse(output)
    t.is(parsed.summary.failed, 1, 'should count failed check')
  } finally {
    process.exitCode = savedExitCode
  }
})

test.serial('doctor command JSON output should include remediation for failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')

  const mockSections = [
    {
      section: 'Environment',
      results: [
        {
          id: 'node',
          name: 'Node.js version',
          ok: false,
          message: 'v18.0.0 found',
          remediation: 'Install Node.js 22+',
          docsUrl: 'https://example.com/docs',
        },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ json: true }, command)

  const output = consoleLogStub.firstCall.args[0]
  const parsed = JSON.parse(output)

  t.is(parsed.checks[0].remediation, 'Install Node.js 22+', 'should include remediation')
  t.is(parsed.checks[0].docsUrl, 'https://example.com/docs', 'should include docsUrl')
})

// ─────────────────────────────────────────────────────────────────────────────
// --errors and --warnings filter tests
// ─────────────────────────────────────────────────────────────────────────────

test('doctor command --errors flag should show only failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
        { id: 'npm', name: 'npm', ok: false, message: 'not found' },
        { id: 'git', name: 'Git', ok: false, level: 'warn', message: 'old version' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ errors: true }, command)

  // Should only show failed checks (not passed or warnings)
  const errorCalls = mockLogger.error.getCalls().map((call) => call.args[0])
  const hasNpm = errorCalls.some((arg) => arg && arg.includes('npm'))
  t.true(hasNpm, 'should show failed npm check')

  // Should not show passed or warning checks in output
  const infoCalls = mockLogger.info.getCalls().map((call) => call.args[0])
  const hasNode = infoCalls.some((arg) => arg && arg.includes('Node.js') && arg.includes('✓'))
  t.false(hasNode, 'should not show passed Node.js check')
})

test('doctor command --warnings flag should show only warning checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
        { id: 'cli', name: 'CLI version', ok: false, level: 'warn', message: 'update available' },
        { id: 'npm', name: 'npm', ok: false, message: 'not found' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ warnings: true }, command)

  // Should show warning checks
  const warnCalls = mockLogger.warn.getCalls().map((call) => call.args[0])
  const hasCli = warnCalls.some((arg) => arg && arg.includes('CLI version'))
  t.true(hasCli, 'should show CLI version warning')

  // Should not show passed checks
  const infoCalls = mockLogger.info.getCalls().map((call) => call.args[0])
  const hasNode = infoCalls.some((arg) => arg && arg.includes('Node.js') && arg.includes('✓'))
  t.false(hasNode, 'should not show passed Node.js check')
})

test('doctor command should show "No failed checks found" when --errors finds none', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
        { id: 'npm', name: 'npm', ok: true, message: '10.2.4' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ errors: true }, command)

  t.true(
    mockLogger.info.calledWith(sinon.match(/No failed checks found/)),
    'should show no failed checks message'
  )
})

test('doctor command should show "No warnings found" when --warnings finds none', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ warnings: true }, command)

  t.true(
    mockLogger.info.calledWith(sinon.match(/No warnings found/)),
    'should show no warnings message'
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// --json [file] file output tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('doctor command --json <file> should write JSON to file', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  // Mock fs.writeFileSync
  const writeFileSyncStub = sandbox.stub()

  const DoctorCommand = await esmock('./doctor.js', {
    'node:fs': {
      writeFileSync: writeFileSyncStub,
    },
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  // When --json has a value, options.json is the filename string
  await command.action({ json: 'report.json' }, command)

  t.true(writeFileSyncStub.calledOnce, 'should call writeFileSync once')
  t.true(
    writeFileSyncStub.firstCall.args[0].endsWith('report.json'),
    'should write to specified file'
  )

  // Verify the content is valid JSON
  const writtenContent = writeFileSyncStub.firstCall.args[1]
  t.notThrows(() => JSON.parse(writtenContent.trim()), 'should write valid JSON')

  t.true(
    mockLogger.info.calledWith(sinon.match(/Results written to/)),
    'should log success message'
  )
})

test.serial('doctor command --json (no file) should write to stdout', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const consoleLogStub = sandbox.stub(console, 'log')

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  // When --json is used without a value, options.json is true
  await command.action({ json: true }, command)

  t.true(consoleLogStub.calledOnce, 'should write to stdout')
  t.notThrows(() => JSON.parse(consoleLogStub.firstCall.args[0]), 'should output valid JSON')
})

test.serial('doctor command --json <file> should not write to stdout', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const consoleLogStub = sandbox.stub(console, 'log')
  const writeFileSyncStub = sandbox.stub()

  const DoctorCommand = await esmock('./doctor.js', {
    'node:fs': {
      writeFileSync: writeFileSyncStub,
    },
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ json: 'report.json' }, command)

  t.false(consoleLogStub.called, 'should not write to stdout when file is specified')
  t.true(writeFileSyncStub.calledOnce, 'should write to file instead')
})

// ─────────────────────────────────────────────────────────────────────────────
// --quiet flag tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('doctor command --quiet alone should produce no output on success', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const consoleLogStub = sandbox.stub(console, 'log')

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  // --quiet alone (no --json) should produce no output
  await command.action({ quiet: true }, command)

  t.false(consoleLogStub.called, 'should not write to stdout')
  t.false(mockLogger.info.called, 'should not log any info messages')
})

test.serial('doctor command --quiet alone should set exitCode 1 on failures', async (t) => {
  const { sandbox, mockLogger } = t.context

  const consoleLogStub = sandbox.stub(console, 'log')
  const savedExitCode = process.exitCode

  try {
    const mockSections = [
      {
        section: 'Environment',
        results: [
          { id: 'npm', name: 'npm', ok: false, message: 'not found' },
        ],
      },
    ]

    const DoctorCommand = await esmock('./doctor.js', {
      '#lib/doctor/index.js': {
        runAllChecksWithSections: sandbox.stub().resolves(mockSections),
      },
    })

    const command = new DoctorCommand()
    command.logger = mockLogger

    // --quiet alone should still set exitCode 1 on failure
    await command.action({ quiet: true }, command)

    t.is(process.exitCode, 1, 'should set process.exitCode to 1')
    t.false(consoleLogStub.called, 'should not output anything')
    t.false(mockLogger.info.called, 'should not log any info messages')
  } finally {
    process.exitCode = savedExitCode
  }
})

test.serial('doctor command --quiet --json should suppress stdout JSON output', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const consoleLogStub = sandbox.stub(console, 'log')

  const DoctorCommand = await esmock('./doctor.js', {
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  // --quiet with --json should suppress JSON stdout output
  await command.action({ quiet: true, json: true }, command)

  t.false(consoleLogStub.called, 'should not write JSON to stdout in quiet mode')
})

test.serial('doctor command --quiet --json <file> should write to file silently', async (t) => {
  const { sandbox, mockLogger } = t.context

  const mockSections = [
    {
      section: 'Environment',
      results: [
        { id: 'node', name: 'Node.js version', ok: true, message: 'v22.0.0' },
      ],
    },
  ]

  const writeFileSyncStub = sandbox.stub()

  const DoctorCommand = await esmock('./doctor.js', {
    'node:fs': {
      writeFileSync: writeFileSyncStub,
    },
    '#lib/doctor/index.js': {
      runAllChecksWithSections: sandbox.stub().resolves(mockSections),
    },
  })

  const command = new DoctorCommand()
  command.logger = mockLogger

  await command.action({ quiet: true, json: 'report.json' }, command)

  t.true(writeFileSyncStub.calledOnce, 'should write to file')
  t.false(
    mockLogger.info.calledWith(sinon.match(/Results written to/)),
    'should not log success message in quiet mode'
  )
})
