import test from 'ava'
import getEpubLib from './index.js'

/**
 * EPUB Module Unit Tests
 *
 * Tests the EPUB generation module interface and API contract.
 * These tests verify the module exports and function signatures
 * without actually generating EPUBs.
 */

// Module export tests
test('epub module exports a function as default', (t) => {
  t.truthy(getEpubLib, 'getEpubLib should be exported')
  t.is(typeof getEpubLib, 'function', 'getEpubLib should be a function')
})

test('getEpubLib is an async function', (t) => {
  t.is(getEpubLib.constructor.name, 'AsyncFunction', 'getEpubLib should be async')
})
