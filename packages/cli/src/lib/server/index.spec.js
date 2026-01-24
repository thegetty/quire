import test from 'ava'
import { serve, getMimeType, MIME_TYPES, DEFAULT_MIME_TYPE } from './index.js'

/**
 * Re-export tests - verify index.js re-exports from mime-types.js
 */
test('index re-exports getMimeType from mime-types module', (t) => {
  t.is(typeof getMimeType, 'function')
  t.is(getMimeType('/test.html'), 'text/html')
})

test('index re-exports MIME_TYPES from mime-types module', (t) => {
  t.is(typeof MIME_TYPES, 'object')
  t.true('.html' in MIME_TYPES)
})

test('index re-exports DEFAULT_MIME_TYPE from mime-types module', (t) => {
  t.is(DEFAULT_MIME_TYPE, 'application/octet-stream')
})

/**
 * serve façade function tests
 */
test('serve is a function', (t) => {
  t.is(typeof serve, 'function')
})

test('serve function accepts rootDir and optional options', (t) => {
  // We can't actually start the server in unit tests without mocking,
  // but we can verify the function signature
  t.is(typeof serve, 'function')
  // Function.length counts only required params (options has default)
  t.is(serve.length, 1)
})
