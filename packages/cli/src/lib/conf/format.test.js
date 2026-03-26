import test from 'ava'
import chalk from 'chalk'
import {
  getKeyDescription,
  formatSettings,
} from './format.js'

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
// formatSettings (plain, useColor=false)
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

// =============================================================================
// formatSettings (useColor=true)
// =============================================================================

test('formatSettings with useColor applies bold to header', (t) => {
  const output = formatSettings({}, { useColor: true })
  t.true(output.includes(chalk.bold('quire-cli configuration')))
})

test('formatSettings with useColor applies bold to header with path', (t) => {
  const output = formatSettings({}, { useColor: true, configPath: '/mock/path' })
  t.true(output.includes(chalk.bold('quire-cli configuration /mock/path')))
})

test('formatSettings with useColor applies cyan to key names', (t) => {
  const store = { logLevel: 'info' }
  const output = formatSettings(store, { useColor: true })
  t.true(output.includes(chalk.cyan('logLevel')))
})

test('formatSettings with useColor applies dim to descriptions', (t) => {
  const store = { logLevel: 'info' }
  const output = formatSettings(store, { useColor: true })
  const desc = getKeyDescription('logLevel')
  t.true(output.includes(chalk.dim(desc)))
})

test('formatSettings with useColor applies dim to help hint', (t) => {
  const output = formatSettings({}, { useColor: true })
  t.true(output.includes(chalk.dim('Use "quire settings set <key> <value>" to change a setting')))
})

test('formatSettings without useColor does not apply ANSI codes', (t) => {
  const store = { logLevel: 'info' }
  const output = formatSettings(store)
  // Plain output should not contain ANSI escape sequences
  // eslint-disable-next-line no-control-regex
  t.false(/\u001b\[/.test(output))
})
