import test from 'ava'
import {
  isValidKey,
  getValidKeys,
  coerceValue,
  formatValidationError,
  getDefault,
  getKeyDescription,
  formatSettings,
} from './helpers.js'

// =============================================================================
// isValidKey
// =============================================================================

test('isValidKey returns true for a known schema key', (t) => {
  t.true(isValidKey('logLevel'))
})

test('isValidKey returns true for all schema keys', (t) => {
  const keys = getValidKeys()
  for (const key of keys) {
    t.true(isValidKey(key), `${key} should be valid`)
  }
})

test('isValidKey returns false for an unknown key', (t) => {
  t.false(isValidKey('nonExistentKey'))
})

test('isValidKey returns false for __internal__ prefixed keys', (t) => {
  t.false(isValidKey('__internal__secretKey'))
})

// =============================================================================
// getValidKeys
// =============================================================================

test('getValidKeys returns an array', (t) => {
  const keys = getValidKeys()
  t.true(Array.isArray(keys))
  t.true(keys.length > 0)
})

test('getValidKeys returns sorted keys', (t) => {
  const keys = getValidKeys()
  const sorted = [...keys].sort()
  t.deepEqual(keys, sorted)
})

test('getValidKeys includes expected keys', (t) => {
  const keys = getValidKeys()
  t.true(keys.includes('logLevel'))
  t.true(keys.includes('quireVersion'))
  t.true(keys.includes('projectTemplate'))
})

// =============================================================================
// coerceValue
// =============================================================================

test('coerceValue coerces "true" to boolean true', (t) => {
  t.is(coerceValue('logShowLevel', 'true'), true)
})

test('coerceValue coerces "false" to boolean false', (t) => {
  t.is(coerceValue('logShowLevel', 'false'), false)
})

test('coerceValue coerces "1" to boolean true for boolean schema', (t) => {
  t.is(coerceValue('logShowLevel', '1'), true)
})

test('coerceValue coerces "0" to boolean false for boolean schema', (t) => {
  t.is(coerceValue('logShowLevel', '0'), false)
})

test('coerceValue passes through non-boolean string for boolean schema', (t) => {
  t.is(coerceValue('logShowLevel', 'maybe'), 'maybe')
})

test('coerceValue passes through string values for string schema', (t) => {
  t.is(coerceValue('logLevel', 'debug'), 'debug')
})

test('coerceValue passes through value for unknown key', (t) => {
  t.is(coerceValue('unknownKey', 'someValue'), 'someValue')
})

// =============================================================================
// formatValidationError
// =============================================================================

test('formatValidationError includes invalid value', (t) => {
  const error = formatValidationError('logLevel', 'invalid')
  t.true(error.includes("Invalid value for 'logLevel'"))
  t.true(error.includes('"invalid"'))
})

test('formatValidationError includes valid enum values', (t) => {
  const error = formatValidationError('logLevel', 'invalid')
  t.true(error.includes('Valid values:'))
  t.true(error.includes('info'))
  t.true(error.includes('debug'))
})

test('formatValidationError includes description', (t) => {
  const error = formatValidationError('logLevel', 'invalid')
  t.true(error.includes('Description:'))
})

test('formatValidationError handles key without enum', (t) => {
  const error = formatValidationError('logPrefix', 123)
  t.true(error.includes("Invalid value for 'logPrefix'"))
  t.false(error.includes('Valid values:'))
})

test('formatValidationError handles unknown key', (t) => {
  const error = formatValidationError('unknownKey', 'value')
  t.true(error.includes("Invalid value for 'unknownKey'"))
})

// =============================================================================
// getDefault
// =============================================================================

test('getDefault returns default value for known key', (t) => {
  t.is(getDefault('logLevel'), 'info')
})

test('getDefault returns default for boolean key', (t) => {
  t.is(getDefault('logShowLevel'), false)
})

test('getDefault returns undefined for unknown key', (t) => {
  t.is(getDefault('unknownKey'), undefined)
})

// =============================================================================
// getKeyDescription
// =============================================================================

test('getKeyDescription returns description for known key', (t) => {
  const desc = getKeyDescription('logLevel')
  t.is(typeof desc, 'string')
  t.true(desc.length > 0)
})

test('getKeyDescription returns undefined for unknown key', (t) => {
  t.is(getKeyDescription('unknownKey'), undefined)
})

// =============================================================================
// formatSettings
// =============================================================================

test('formatSettings includes header with config path', (t) => {
  const output = formatSettings({}, { configPath: '/mock/path' })
  t.true(output.includes('quire-cli configuration /mock/path'))
})

test('formatSettings includes header without config path', (t) => {
  const output = formatSettings({})
  t.true(output.includes('quire-cli configuration'))
})

test('formatSettings includes key-value pairs', (t) => {
  const store = { logLevel: 'info', logShowLevel: false }
  const output = formatSettings(store)
  t.true(output.includes('logLevel: "info"'))
  t.true(output.includes('logShowLevel: false'))
})

test('formatSettings includes schema descriptions', (t) => {
  const store = { logLevel: 'info' }
  const output = formatSettings(store)
  // logLevel has a description in the schema
  const desc = getKeyDescription('logLevel')
  t.true(output.includes(desc))
})

test('formatSettings hides __internal__ keys by default', (t) => {
  const store = { logLevel: 'info', __internal__secret: 'hidden' }
  const output = formatSettings(store)
  t.false(output.includes('__internal__secret'))
})

test('formatSettings shows __internal__ keys with showInternal', (t) => {
  const store = { logLevel: 'info', __internal__secret: 'hidden' }
  const output = formatSettings(store, { showInternal: true })
  t.true(output.includes('__internal__secret'))
  t.true(output.includes('"hidden"'))
})

test('formatSettings includes help hint', (t) => {
  const output = formatSettings({})
  t.true(output.includes('Use "quire settings set <key> <value>" to change a setting'))
})
