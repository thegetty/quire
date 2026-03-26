import test from 'ava'
import npm from './index.js'

/**
 * NPM Façade Unit Tests
 *
 * Tests the npm façade module interface and API contract.
 * These tests verify the module exports and method signatures
 * without actually executing npm commands.
 */

test('npm façade exports a singleton object', (t) => {
  t.truthy(npm, 'npm should be exported')
  t.is(typeof npm, 'object', 'npm should be an object')
})

test('npm façade has isAvailable method', (t) => {
  t.is(typeof npm.isAvailable, 'function', 'isAvailable should be a function')
})

test('npm façade has version method', (t) => {
  t.is(typeof npm.version, 'function', 'version should be a function')
})

test('npm façade has init method', (t) => {
  t.is(typeof npm.init, 'function', 'init should be a function')
})

test('npm façade has install method', (t) => {
  t.is(typeof npm.install, 'function', 'install should be a function')
})

test('npm façade has pack method', (t) => {
  t.is(typeof npm.pack, 'function', 'pack should be a function')
})

test('npm façade has cacheClean method', (t) => {
  t.is(typeof npm.cacheClean, 'function', 'cacheClean should be a function')
})

test('npm façade has view method', (t) => {
  t.is(typeof npm.view, 'function', 'view should be a function')
})

test('npm façade has show method', (t) => {
  t.is(typeof npm.show, 'function', 'show should be a function')
})

test('npm façade has fetchFromRegistry method', (t) => {
  t.is(typeof npm.fetchFromRegistry, 'function', 'fetchFromRegistry should be a function')
})

test('npm façade has getCompatibleVersion method', (t) => {
  t.is(typeof npm.getCompatibleVersion, 'function', 'getCompatibleVersion should be a function')
})

test('isAvailable returns a boolean', (t) => {
  const result = npm.isAvailable()
  t.is(typeof result, 'boolean', 'isAvailable should return a boolean')
})
