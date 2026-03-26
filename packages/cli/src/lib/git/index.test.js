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

// isRemoteUrl() tests
test('isRemoteUrl() returns true for https URLs', async (t) => {
  const { isRemoteUrl } = await import('./index.js')

  t.true(isRemoteUrl('https://github.com/user/repo'))
  t.true(isRemoteUrl('https://github.com/user/repo.git'))
})

test('isRemoteUrl() returns true for http URLs', async (t) => {
  const { isRemoteUrl } = await import('./index.js')

  t.true(isRemoteUrl('http://github.com/user/repo'))
})

test('isRemoteUrl() returns true for git@ SSH URLs', async (t) => {
  const { isRemoteUrl } = await import('./index.js')

  t.true(isRemoteUrl('git@github.com:user/repo.git'))
  t.true(isRemoteUrl('git@gitlab.com:user/repo'))
})

test('isRemoteUrl() returns true for ssh:// URLs', async (t) => {
  const { isRemoteUrl } = await import('./index.js')

  t.true(isRemoteUrl('ssh://git@github.com/user/repo.git'))
})

test('isRemoteUrl() returns true for git:// URLs', async (t) => {
  const { isRemoteUrl } = await import('./index.js')

  t.true(isRemoteUrl('git://github.com/user/repo.git'))
})

test('isRemoteUrl() returns false for local paths', async (t) => {
  const { isRemoteUrl } = await import('./index.js')

  t.false(isRemoteUrl('/path/to/local/repo'))
  t.false(isRemoteUrl('./relative/path'))
  t.false(isRemoteUrl('../parent/path'))
  t.false(isRemoteUrl('local-folder'))
})

// isGitRepository() tests
test('isGitRepository() returns true when .git directory exists', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(true)
  }

  const { isGitRepository } = await esmock('./index.js', {
    'node:fs': mockFs
  })

  const result = isGitRepository('/path/to/repo')

  t.true(result)
  t.true(mockFs.existsSync.calledOnce)
})

test('isGitRepository() returns false when .git directory does not exist', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(false)
  }

  const { isGitRepository } = await esmock('./index.js', {
    'node:fs': mockFs
  })

  const result = isGitRepository('/path/without/git')

  t.false(result)
})

// validateCloneSource() tests
test('validateCloneSource() returns valid for remote URLs', async (t) => {
  const { validateCloneSource } = await import('./index.js')

  t.deepEqual(validateCloneSource('https://github.com/user/repo'), { valid: true })
  t.deepEqual(validateCloneSource('git@github.com:user/repo.git'), { valid: true })
})

test('validateCloneSource() returns invalid when local path does not exist', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(false)
  }

  const { validateCloneSource } = await esmock('./index.js', {
    'node:fs': mockFs
  })

  const result = validateCloneSource('/nonexistent/path')

  t.false(result.valid)
  t.is(result.reason, 'path does not exist')
})

test('validateCloneSource() returns invalid when path is not a git repository', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub()
      .onFirstCall().returns(true)   // path exists
      .onSecondCall().returns(false) // .git does not exist
  }

  const { validateCloneSource } = await esmock('./index.js', {
    'node:fs': mockFs
  })

  const result = validateCloneSource('/path/without/git')

  t.false(result.valid)
  t.is(result.reason, 'not a git repository')
})

test('validateCloneSource() returns valid for local git repository', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    existsSync: sandbox.stub().returns(true) // both path and .git exist
  }

  const { validateCloneSource } = await esmock('./index.js', {
    'node:fs': mockFs
  })

  const result = validateCloneSource('/path/to/repo')

  t.true(result.valid)
  t.is(result.reason, undefined)
})
