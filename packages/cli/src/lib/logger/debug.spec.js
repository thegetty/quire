import test from 'ava'
import createDebug, {
  DEBUG_NAMESPACE,
  createRawDebug,
  disableDebug,
  enableDebug,
  isDebugEnabled
} from './debug.js'

/**
 * Debug Module Unit Tests
 *
 * Tests the debug factory exports and API surface.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Export tests
// ─────────────────────────────────────────────────────────────────────────────

test('createDebug is exported as default', (t) => {
  t.is(typeof createDebug, 'function')
})

test('DEBUG_NAMESPACE constant is exported', (t) => {
  t.is(DEBUG_NAMESPACE, 'quire')
})

test('createRawDebug is exported', (t) => {
  t.is(typeof createRawDebug, 'function')
})

test('disableDebug is exported', (t) => {
  t.is(typeof disableDebug, 'function')
})

test('enableDebug is exported', (t) => {
  t.is(typeof enableDebug, 'function')
})

test('isDebugEnabled is exported', (t) => {
  t.is(typeof isDebugEnabled, 'function')
})

// ─────────────────────────────────────────────────────────────────────────────
// Factory function tests
// ─────────────────────────────────────────────────────────────────────────────

test('createDebug returns a function', (t) => {
  const debug = createDebug('test')
  t.is(typeof debug, 'function')
})

test('createDebug creates debug instance with quire prefix', (t) => {
  const debug = createDebug('lib:pdf')
  // Debug instances have a namespace property
  t.is(debug.namespace, 'quire:lib:pdf')
})

test('createDebug supports nested namespaces', (t) => {
  const debug = createDebug('lib:pdf:paged')
  t.is(debug.namespace, 'quire:lib:pdf:paged')
})

test('createRawDebug creates debug instance without prefix', (t) => {
  const debug = createRawDebug('custom:namespace')
  t.is(debug.namespace, 'custom:namespace')
})

// ─────────────────────────────────────────────────────────────────────────────
// Enable/disable tests
// ─────────────────────────────────────────────────────────────────────────────

test.serial('enableDebug enables debug output for namespace', (t) => {
  // Clean state
  disableDebug()
  t.false(isDebugEnabled('lib:pdf'))

  enableDebug('quire:lib:pdf')
  t.true(isDebugEnabled('lib:pdf'))

  // Cleanup
  disableDebug()
})

test.serial('enableDebug supports wildcards', (t) => {
  disableDebug()
  t.false(isDebugEnabled('lib:pdf'))
  t.false(isDebugEnabled('lib:epub'))

  enableDebug('quire:lib:*')
  t.true(isDebugEnabled('lib:pdf'))
  t.true(isDebugEnabled('lib:epub'))

  // Cleanup
  disableDebug()
})

test.serial('disableDebug disables all debug output', (t) => {
  enableDebug('quire:*')
  t.true(isDebugEnabled('lib:pdf'))

  disableDebug()
  t.false(isDebugEnabled('lib:pdf'))
})

test.serial('isDebugEnabled returns false when not enabled', (t) => {
  disableDebug()
  t.false(isDebugEnabled('lib:pdf'))
  t.false(isDebugEnabled('commands:build'))
})

// ─────────────────────────────────────────────────────────────────────────────
// Debug instance behavior tests
// ─────────────────────────────────────────────────────────────────────────────

test('debug instance has extend method', (t) => {
  const debug = createDebug('lib:pdf')
  t.is(typeof debug.extend, 'function')
})

test('debug instance can be extended', (t) => {
  const debug = createDebug('lib:pdf')
  const extended = debug.extend('paged')
  t.is(extended.namespace, 'quire:lib:pdf:paged')
})

test('debug instance has enabled property', (t) => {
  const debug = createDebug('test:namespace')
  t.is(typeof debug.enabled, 'boolean')
})
