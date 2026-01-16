import test from 'ava'
import generatePdf from './index.js'

/**
 * PDF Module Unit Tests
 *
 * Tests the PDF generation module interface and API contract.
 * These tests verify the module exports and function signatures
 * without actually generating PDFs.
 */

// Module export tests
test('pdf module exports generatePdf function as default', (t) => {
  t.truthy(generatePdf, 'generatePdf should be exported')
  t.is(typeof generatePdf, 'function', 'generatePdf should be a function')
})

test('generatePdf is an async function', (t) => {
  t.is(generatePdf.constructor.name, 'AsyncFunction', 'generatePdf should be async')
})
