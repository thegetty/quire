import test from 'ava'
import git from './index.js'

/**
 * Git Façade Unit Tests
 *
 * Tests the git façade module interface and API contract.
 * These tests verify the module exports and method signatures
 * without actually executing git commands.
 */

test('git façade exports a singleton object', (t) => {
  t.truthy(git, 'git should be exported')
  t.is(typeof git, 'object', 'git should be an object')
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
