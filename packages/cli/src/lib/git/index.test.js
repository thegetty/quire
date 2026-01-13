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

test('add() stages single file', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.add('file.js', '/path/to/project')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['add', 'file.js'], { cwd: '/path/to/project' }))
})

test('add() stages multiple files', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.add(['file1.js', 'file2.js'], '/path/to/project')

  t.true(mockExeca.calledWith('git', ['add', 'file1.js', 'file2.js'], { cwd: '/path/to/project' }))
})

test('add() stages all files with dot notation', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.add('.', '/path/to/project')

  t.true(mockExeca.calledWith('git', ['add', '.'], { cwd: '/path/to/project' }))
})

test('clone() clones repository to destination', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.clone('https://github.com/user/repo', 'dest', '/path/to/parent')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['clone', 'https://github.com/user/repo', 'dest'], { cwd: '/path/to/parent' }))
})

test('clone() uses current directory as default destination', async (t) => {
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

test('commit() creates commit with message', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.commit('Initial commit', '/path/to/project')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['commit', '-m', 'Initial commit'], { cwd: '/path/to/project' }))
})

test('init() initializes repository', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.init('/path/to/project')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['init'], { cwd: '/path/to/project' }))
})

test('init() works without cwd parameter', async (t) => {
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

test('rm() removes single file', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.rm('package.json', '/path/to/project')

  t.true(mockExeca.calledOnce)
  t.true(mockExeca.calledWith('git', ['rm', 'package.json'], { cwd: '/path/to/project' }))
})

test('rm() removes multiple files', async (t) => {
  const { sandbox } = t.context

  const mockExeca = sandbox.stub().resolves({})
  const mockWhich = sandbox.stub().returns('/usr/bin/git')

  const git = await esmock('./index.js', {
    execa: { execa: mockExeca },
    '#helpers/which.js': { default: mockWhich },
  })

  await git.rm(['file1.js', 'file2.js'], '/path/to/project')

  t.true(mockExeca.calledWith('git', ['rm', 'file1.js', 'file2.js'], { cwd: '/path/to/project' }))
})

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
