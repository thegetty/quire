import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * Git Façade Integration Tests
 *
 * Tests the git façade module behavior with mocked dependencies.
 * Uses esmock to replace execa calls.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

// Singleton tests (default export, no cwd)
test('singleton add() stages files without cwd', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.add('file.js')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['add', 'file.js'], {}))
})

test('singleton clone() uses empty options', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.clone('https://github.com/user/repo')

  t.true(mockExeca.calledWith('git', ['clone', 'https://github.com/user/repo', '.'], {}))
})

test('singleton init() uses empty options', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.init()

  t.true(mockExeca.calledWith('git', ['init'], {}))
})

// Git class instance tests (with cwd)
test('instance add() stages single file with cwd', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/project')
  await repo.add('file.js')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['add', 'file.js'], { cwd: '/path/to/project' }))
})

test('instance add() stages multiple files', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/project')
  await repo.add(['file1.js', 'file2.js'])

  t.true(mockExeca.calledWith('git', ['add', 'file1.js', 'file2.js'], { cwd: '/path/to/project' }))
})

test('instance add() stages all files with dot notation', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/project')
  await repo.add('.')

  t.true(mockExeca.calledWith('git', ['add', '.'], { cwd: '/path/to/project' }))
})

test('instance clone() clones repository to destination', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/parent')
  await repo.clone('https://github.com/user/repo', 'dest')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['clone', 'https://github.com/user/repo', 'dest'], { cwd: '/path/to/parent' }))
})

test('instance clone() uses current directory as default destination', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/parent')
  await repo.clone('https://github.com/user/repo')

  t.true(mockExeca.calledWith('git', ['clone', 'https://github.com/user/repo', '.'], { cwd: '/path/to/parent' }))
})

test('instance commit() creates commit with message', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/project')
  await repo.commit('Initial commit')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['commit', '-m', 'Initial commit'], { cwd: '/path/to/project' }))
})

test('instance init() initializes repository', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/project')
  await repo.init()

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['init'], { cwd: '/path/to/project' }))
})

test('instance rm() removes single file', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/project')
  await repo.rm('package.json')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['rm', 'package.json'], { cwd: '/path/to/project' }))
})

test('instance rm() removes multiple files', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const repo = new Git('/path/to/project')
  await repo.rm(['file1.js', 'file2.js'])

  t.true(mockExeca.calledWith('git', ['rm', 'file1.js', 'file2.js'], { cwd: '/path/to/project' }))
})

// Global methods (work same on singleton or instance)
test('version() returns git version string', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stdout: 'git version 2.39.0' })
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  const result = await git.version()

  t.is(result, '2.39.0')
  t.true(mockExeca.calledWith('git', ['--version']))
})

test('isAvailable() returns true when git is found in PATH', async (t) => {
  const { sandbox } = t.context

  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich },
  })

  const result = git.isAvailable()

  t.true(result)
  t.true(mockWhich.calledWith('git'))
})

test('isAvailable() returns false when git is not found in PATH', async (t) => {
  const { sandbox } = t.context

  const mockWhich = sandbox.stub().returns(null)

  const git = await esmock('./index.js', {
    execa: { execa: sandbox.stub() },
    '#helpers/which.js': { default: mockWhich },
  })

  const result = git.isAvailable()

  t.false(result)
})

test('instance add() logs stderr via debug when present', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stderr: 'warning: LF will be replaced by CRLF' })
  const mockWhich = sandbox.stub().returns('/usr/bin/git')
  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
    '#debug': { default: mockCreateDebug }
  })

  const repo = new Git('/path/to/project')
  await repo.add('file.js')

  t.true(mockDebug.calledWith('git add stderr: %s', 'warning: LF will be replaced by CRLF'))
})

test('instance commit() logs stderr via debug when present', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({ stderr: '[main abc1234] commit message' })
  const mockWhich = sandbox.stub().returns('/usr/bin/git')
  const mockDebug = sandbox.stub()
  const mockCreateDebug = sandbox.stub().returns(mockDebug)

  const { Git } = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
    '#debug': { default: mockCreateDebug }
  })

  const repo = new Git('/path/to/project')
  await repo.commit('test commit')

  t.true(mockDebug.calledWith('git commit stderr: %s', '[main abc1234] commit message'))
})
