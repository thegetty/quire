import test from 'ava'
import eleventy, { api, cli, paths, Paths } from './index.js'

/**
 * Eleventy Module Unit Tests
 *
 * Tests the Eleventy façade module interface and API contract.
 * These tests verify the module exports and method signatures
 * without actually running Eleventy.
 */

// Default export tests
test('eleventy module exports a singleton object', (t) => {
  t.truthy(eleventy, 'eleventy should be exported')
  t.is(typeof eleventy, 'object', 'eleventy should be an object')
})

test('eleventy singleton has build method', (t) => {
  t.is(typeof eleventy.build, 'function', 'build should be a function')
})

test('eleventy singleton has serve method', (t) => {
  t.is(typeof eleventy.serve, 'function', 'serve should be a function')
})

test('eleventy singleton has paths property', (t) => {
  t.truthy(eleventy.paths, 'paths should exist')
  t.is(typeof eleventy.paths, 'object', 'paths should be an object')
})

// Legacy api export tests
test('api object is exported for backwards compatibility', (t) => {
  t.truthy(api, 'api should be exported')
  t.is(typeof api, 'object', 'api should be an object')
})

test('api has build method', (t) => {
  t.is(typeof api.build, 'function', 'api.build should be a function')
})

test('api has serve method', (t) => {
  t.is(typeof api.serve, 'function', 'api.serve should be a function')
})

// CLI export tests
test('cli object is exported', (t) => {
  t.truthy(cli, 'cli should be exported')
  t.is(typeof cli, 'object', 'cli should be an object')
})

test('cli has build method', (t) => {
  t.is(typeof cli.build, 'function', 'cli.build should be a function')
})

test('cli has serve method', (t) => {
  t.is(typeof cli.serve, 'function', 'cli.serve should be a function')
})

// Paths export tests
test('paths singleton is exported', (t) => {
  t.truthy(paths, 'paths should be exported')
  t.is(typeof paths, 'object', 'paths should be an object')
})

test('Paths class is exported', (t) => {
  t.truthy(Paths, 'Paths should be exported')
  t.is(typeof Paths, 'function', 'Paths should be a constructor')
})

// Paths methods tests
test('paths has getProjectRoot method', (t) => {
  t.is(typeof paths.getProjectRoot, 'function', 'getProjectRoot should be a function')
})

test('paths has getInputDir method', (t) => {
  t.is(typeof paths.getInputDir, 'function', 'getInputDir should be a function')
})

test('paths has getOutputDir method', (t) => {
  t.is(typeof paths.getOutputDir, 'function', 'getOutputDir should be a function')
})

test('paths has getDataDir method', (t) => {
  t.is(typeof paths.getDataDir, 'function', 'getDataDir should be a function')
})

test('paths has getIncludesDir method', (t) => {
  t.is(typeof paths.getIncludesDir, 'function', 'getIncludesDir should be a function')
})

test('paths has getLayoutsDir method', (t) => {
  t.is(typeof paths.getLayoutsDir, 'function', 'getLayoutsDir should be a function')
})

test('paths has getConfigPath method', (t) => {
  t.is(typeof paths.getConfigPath, 'function', 'getConfigPath should be a function')
})

test('paths has getEleventyRoot method', (t) => {
  t.is(typeof paths.getEleventyRoot, 'function', 'getEleventyRoot should be a function')
})

test('paths has toObject method', (t) => {
  t.is(typeof paths.toObject, 'function', 'toObject should be a function')
})
