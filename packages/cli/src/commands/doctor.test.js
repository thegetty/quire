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
 *
 * Note: For tests that trigger errors, the exitStub will capture process.exit calls
 * but we need to stub process.exit globally before calling action().
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

test.serial('doctor command should report failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  // Stub process.exit before running to prevent test from exiting
  const exitStub = sinon.stub(process, 'exit')

  try {
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
      mockLogger.error.calledWith(sinon.match(/Some checks failed/)),
      'should report failures'
    )
  } finally {
    exitStub.restore()
  }
})

test.serial('doctor command should display remediation guidance for failed checks', async (t) => {
  const { sandbox, mockLogger } = t.context

  // Stub process.exit before running to prevent test from exiting
  const exitStub = sinon.stub(process, 'exit')

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
  } finally {
    exitStub.restore()
  }
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
    mockLogger.warn.calledWith(sinon.match(/All checks passed with warnings/)),
    'should report passed with warnings'
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
// Exit code tests (run serially to avoid process.exit stub conflicts)
// ─────────────────────────────────────────────────────────────────────────────

test.serial('doctor command should exit with code 1 when checks fail', async (t) => {
  const { sandbox, mockLogger } = t.context

  // Stub process.exit before running
  const exitStub = sinon.stub(process, 'exit')

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

    t.true(exitStub.calledOnce, 'should call process.exit')
    t.true(exitStub.calledWith(1), 'should exit with code 1')
  } finally {
    exitStub.restore()
  }
})

test.serial('doctor command should not exit when all checks pass', async (t) => {
  const { sandbox, mockLogger } = t.context

  // Stub process.exit to verify it's NOT called
  const exitStub = sinon.stub(process, 'exit')

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

    t.false(exitStub.called, 'should not call process.exit on success')
  } finally {
    exitStub.restore()
  }
})

test.serial('doctor command should not exit when only warnings exist', async (t) => {
  const { sandbox, mockLogger } = t.context

  // Stub process.exit to verify it's NOT called for warnings
  const exitStub = sinon.stub(process, 'exit')

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

    t.false(exitStub.called, 'should not call process.exit for warnings')
    t.true(
      mockLogger.warn.calledWith(sinon.match(/All checks passed with warnings/)),
      'should report passed with warnings'
    )
  } finally {
    exitStub.restore()
  }
})
