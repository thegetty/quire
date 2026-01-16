import test from 'ava'
import config from './config.js'
import defaults from './defaults.js'

/**
 * Conf Module Unit Tests
 *
 * Tests the CLI configuration module interface and API contract.
 * These tests verify the module exports and method signatures
 * without modifying the actual configuration.
 */

// Module export tests
test('config module exports a Conf instance', (t) => {
  t.truthy(config, 'config should be exported')
  t.is(typeof config, 'object', 'config should be an object')
})

// Conf instance method tests
test('config has get method', (t) => {
  t.is(typeof config.get, 'function', 'get should be a function')
})

test('config has set method', (t) => {
  t.is(typeof config.set, 'function', 'set should be a function')
})

test('config has has method', (t) => {
  t.is(typeof config.has, 'function', 'has should be a function')
})

test('config has delete method', (t) => {
  t.is(typeof config.delete, 'function', 'delete should be a function')
})

test('config has clear method', (t) => {
  t.is(typeof config.clear, 'function', 'clear should be a function')
})

test('config has path property', (t) => {
  t.is(typeof config.path, 'string', 'path should be a string')
})

test('config has store property', (t) => {
  t.truthy(config.store, 'store should exist')
  t.is(typeof config.store, 'object', 'store should be an object')
})

// Default values tests
test('config returns default logLevel', (t) => {
  t.is(config.get('logLevel'), defaults.logLevel, 'logLevel should match default')
})

test('config returns default projectTemplate', (t) => {
  t.is(config.get('projectTemplate'), defaults.projectTemplate, 'projectTemplate should match default')
})

test('config returns default quire11tyPath', (t) => {
  t.is(config.get('quire11tyPath'), defaults.quire11tyPath, 'quire11tyPath should match default')
})

test('config returns default quireVersion', (t) => {
  t.is(config.get('quireVersion'), defaults.quireVersion, 'quireVersion should match default')
})

test('config returns default updateChannel', (t) => {
  t.is(config.get('updateChannel'), defaults.updateChannel, 'updateChannel should match default')
})

test('config returns default updateInterval', (t) => {
  t.is(config.get('updateInterval'), defaults.updateInterval, 'updateInterval should match default')
})

test('config returns default versionFile', (t) => {
  t.is(config.get('versionFile'), defaults.versionFile, 'versionFile should match default')
})

// Type validation tests (schema enforces string type)
test('config has method returns true for existing keys', (t) => {
  t.true(config.has('logLevel'), 'should have logLevel')
  t.true(config.has('projectTemplate'), 'should have projectTemplate')
  t.true(config.has('versionFile'), 'should have versionFile')
})

test('config has method returns false for non-existing keys', (t) => {
  t.false(config.has('nonExistentKey'), 'should not have nonExistentKey')
})
