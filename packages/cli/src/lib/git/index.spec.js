import test from 'ava'
import git, { Git } from './index.js'

/**
 * Git Façade Unit Tests
 *
 * Tests the git façade module interface and API contract.
 * These tests verify the module exports and method signatures
 * without actually executing git commands.
 */

// Default singleton export tests
test('git façade exports a singleton object', (t) => {
  t.truthy(git, 'git should be exported')
  t.is(typeof git, 'object', 'git should be an object')
})

test('git façade singleton has no cwd by default', (t) => {
  t.is(git.cwd, undefined, 'singleton cwd should be undefined')
})

test('git façade has add method', (t) => {
  t.is(typeof git.add, 'function', 'add should be a function')
})

test('git façade has clone method', (t) => {
  t.is(typeof git.clone, 'function', 'clone should be a function')
})

test('git façade has commit method', (t) => {
  t.is(typeof git.commit, 'function', 'commit should be a function')
})

test('git façade has init method', (t) => {
  t.is(typeof git.init, 'function', 'init should be a function')
})

test('git façade has isAvailable method', (t) => {
  t.is(typeof git.isAvailable, 'function', 'isAvailable should be a function')
})

test('git façade has rm method', (t) => {
  t.is(typeof git.rm, 'function', 'rm should be a function')
})

test('git façade has version method', (t) => {
  t.is(typeof git.version, 'function', 'version should be a function')
})

test('isAvailable returns a boolean', (t) => {
  const result = git.isAvailable()
  t.is(typeof result, 'boolean', 'isAvailable should return a boolean')
})

// Git class export tests
test('Git class is exported', (t) => {
  t.truthy(Git, 'Git class should be exported')
  t.is(typeof Git, 'function', 'Git should be a constructor')
})

test('Git class can be instantiated with cwd', (t) => {
  const repo = new Git('/path/to/project')
  t.is(repo.cwd, '/path/to/project', 'cwd should be set from constructor')
})

test('Git class can be instantiated without cwd', (t) => {
  const repo = new Git()
  t.is(repo.cwd, undefined, 'cwd should be undefined when not provided')
})

test('Git instance has all methods', (t) => {
  const repo = new Git('/path/to/project')
  t.is(typeof repo.add, 'function', 'add should be a function')
  t.is(typeof repo.clone, 'function', 'clone should be a function')
  t.is(typeof repo.commit, 'function', 'commit should be a function')
  t.is(typeof repo.init, 'function', 'init should be a function')
  t.is(typeof repo.isAvailable, 'function', 'isAvailable should be a function')
  t.is(typeof repo.rm, 'function', 'rm should be a function')
  t.is(typeof repo.version, 'function', 'version should be a function')
})
