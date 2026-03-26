import test from 'ava'
import debug from 'debug'
// Import to register formatter and formatArgs overrides
import './debug.js'

/**
 * Debug formatter and output tests
 *
 * Verifies the custom %O formatter produces indented multi-line output,
 * the %o formatter remains compact single-line, and the formatArgs
 * override prevents per-line namespace prefixing in colored output.
 */

/**
 * Helper to call a debug formatter with a value
 *
 * Formatters are called with `this` bound to a debugger-like context.
 * We provide the minimal context the formatters expect.
 */
function callFormatter(specifier, value) {
  const formatter = debug.formatters[specifier]
  const context = {
    useColors: false,
    inspectOpts: { colors: false },
  }
  return formatter.call(context, value)
}

// ─────────────────────────────────────────────────────────────────────────────
// %O formatter (pretty-printed, indented)
// ─────────────────────────────────────────────────────────────────────────────

test('%O output starts with a newline', (t) => {
  const result = callFormatter('O', { a: 1 })
  t.true(result.startsWith('\n'))
})

test('%O output lines are indented with 2 spaces', (t) => {
  const result = callFormatter('O', { a: 1, b: 2 })
  const lines = result.split('\n').slice(1) // skip leading empty line
  for (const line of lines) {
    t.true(line.startsWith('  '), `Line not indented: "${line}"`)
  }
})

test('%O formats nested objects with indentation', (t) => {
  const result = callFormatter('O', { outer: { inner: 'value' } })
  t.true(result.includes('outer'))
  t.true(result.includes('inner'))
  // Every line after the leading newline should be indented
  const lines = result.split('\n').slice(1)
  for (const line of lines) {
    t.true(line.startsWith('  '), `Line not indented: "${line}"`)
  }
})

test('%O handles null without error', (t) => {
  const result = callFormatter('O', null)
  t.true(result.includes('null'))
})

test('%O handles undefined without error', (t) => {
  const result = callFormatter('O', undefined)
  t.true(result.includes('undefined'))
})

test('%O handles primitive values', (t) => {
  t.true(callFormatter('O', 42).includes('42'))
  t.true(callFormatter('O', 'hello').includes('hello'))
  t.true(callFormatter('O', true).includes('true'))
})

test('%O handles arrays', (t) => {
  const result = callFormatter('O', [1, 2, 3])
  t.true(result.includes('1'))
  t.true(result.includes('2'))
  t.true(result.includes('3'))
})

// ─────────────────────────────────────────────────────────────────────────────
// %o formatter (compact single-line, built-in)
// ─────────────────────────────────────────────────────────────────────────────

test('%o output is single-line', (t) => {
  const result = callFormatter('o', { a: 1, b: 2, c: 3 })
  t.false(result.includes('\n'))
})

test('%o does not start with a newline', (t) => {
  const result = callFormatter('o', { a: 1 })
  t.false(result.startsWith('\n'))
})

// ─────────────────────────────────────────────────────────────────────────────
// formatArgs override (prefix only on first line)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper to call formatArgs and capture the result
 *
 * Creates a minimal debugger-like context to test formatArgs behavior.
 * In color mode, the default debug formatArgs would split on newlines
 * and insert the prefix before every line. Our override prevents this.
 */
function callFormatArgs(message, useColors = true) {
  const args = [message]
  const context = {
    namespace: 'test',
    useColors,
    color: 5,
    diff: 0,
  }
  debug.formatArgs.call(context, args)
  return args[0]
}

test('formatArgs prefixes the first line in color mode', (t) => {
  const result = callFormatArgs('hello')
  t.true(result.includes('test'))
  t.true(result.includes('hello'))
})

test('formatArgs does not duplicate prefix on multi-line output', (t) => {
  const result = callFormatArgs('paths:\n  { a: 1 }\n  { b: 2 }')
  // Namespace should appear exactly once
  const matches = result.match(/test/g)
  t.is(matches.length, 1)
})
