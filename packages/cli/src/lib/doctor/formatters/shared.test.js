/**
 * Tests for shared formatter utilities
 */
import test from 'ava'
import { getStatus, STATUS_ICONS, countResults, filterResults, getTerminalWidth } from './shared.js'

// =============================================================================
// getStatus tests
// =============================================================================

test('getStatus returns "na" for level na', (t) => {
  t.is(getStatus({ ok: true, level: 'na' }), 'na')
  t.is(getStatus({ ok: false, level: 'na' }), 'na')
})

test('getStatus returns "timeout" for level timeout', (t) => {
  t.is(getStatus({ ok: false, level: 'timeout' }), 'timeout')
})

test('getStatus returns "passed" when ok is true', (t) => {
  t.is(getStatus({ ok: true }), 'passed')
  t.is(getStatus({ ok: true, level: 'error' }), 'passed')
})

test('getStatus returns "warning" for level warn when not ok', (t) => {
  t.is(getStatus({ ok: false, level: 'warn' }), 'warning')
})

test('getStatus returns "failed" for level error when not ok', (t) => {
  t.is(getStatus({ ok: false, level: 'error' }), 'failed')
  t.is(getStatus({ ok: false }), 'failed')
})

// =============================================================================
// STATUS_ICONS tests
// =============================================================================

test('STATUS_ICONS has all required status types', (t) => {
  t.truthy(STATUS_ICONS.passed)
  t.truthy(STATUS_ICONS.failed)
  t.truthy(STATUS_ICONS.warning)
  t.truthy(STATUS_ICONS.timeout)
  t.truthy(STATUS_ICONS.na)
})

test('STATUS_ICONS are strings containing expected characters', (t) => {
  // Strip ANSI codes to check actual characters
  const stripAnsi = (str) => str.replace(/\u001b\[[0-9;]*m/g, '')
  t.is(stripAnsi(STATUS_ICONS.passed), '✓')
  t.is(stripAnsi(STATUS_ICONS.failed), '✗')
  t.is(stripAnsi(STATUS_ICONS.warning), '⚠')
  t.is(stripAnsi(STATUS_ICONS.timeout), '⏱')
  t.is(stripAnsi(STATUS_ICONS.na), '○')
})

// =============================================================================
// countResults tests
// =============================================================================

const mockSections = [
  {
    section: 'Environment',
    results: [
      { id: 'os', ok: true },
      { id: 'cli', ok: true },
      { id: 'node', ok: false, level: 'error' },
    ],
  },
  {
    section: 'Project',
    results: [
      { id: 'project', ok: false, level: 'warn' },
      { id: 'deps', ok: true, level: 'na' },
      { id: 'data', ok: false, level: 'timeout' },
    ],
  },
]

test('countResults counts all status types correctly', (t) => {
  const counts = countResults(mockSections)
  t.is(counts.passed, 2)
  t.is(counts.failed, 1)
  t.is(counts.warnings, 1)
  t.is(counts.timeouts, 1)
  t.is(counts.na, 1)
  t.is(counts.total, 6)
})

test('countResults with errors filter counts only failed', (t) => {
  const counts = countResults(mockSections, { errors: true })
  t.is(counts.failed, 1)
  t.is(counts.passed, 0)
  t.is(counts.warnings, 0)
  t.is(counts.total, 1)
})

test('countResults with warnings filter counts only warnings', (t) => {
  const counts = countResults(mockSections, { warnings: true })
  t.is(counts.warnings, 1)
  t.is(counts.passed, 0)
  t.is(counts.failed, 0)
  t.is(counts.total, 1)
})

// =============================================================================
// filterResults tests
// =============================================================================

test('filterResults returns all results when no filter applied', (t) => {
  const filtered = filterResults(mockSections)
  t.is(filtered.length, 2)
  t.is(filtered[0].results.length, 3)
  t.is(filtered[1].results.length, 3)
})

test('filterResults with errors filter returns only failed checks', (t) => {
  const filtered = filterResults(mockSections, { errors: true })
  t.is(filtered.length, 1) // Only Environment section has failed check
  t.is(filtered[0].section, 'Environment')
  t.is(filtered[0].results.length, 1)
  t.is(filtered[0].results[0].id, 'node')
})

test('filterResults with warnings filter returns only warning checks', (t) => {
  const filtered = filterResults(mockSections, { warnings: true })
  t.is(filtered.length, 1) // Only Project section has warning check
  t.is(filtered[0].section, 'Project')
  t.is(filtered[0].results.length, 1)
  t.is(filtered[0].results[0].id, 'project')
})

test('countResults with both errors and warnings filter counts failed and warnings', (t) => {
  const counts = countResults(mockSections, { errors: true, warnings: true })
  t.is(counts.failed, 1)
  t.is(counts.warnings, 1)
  t.is(counts.passed, 0)
  t.is(counts.timeouts, 0)
  t.is(counts.na, 0)
  t.is(counts.total, 2)
})

test('filterResults with both errors and warnings returns failed and warning checks', (t) => {
  const filtered = filterResults(mockSections, { errors: true, warnings: true })
  t.is(filtered.length, 2) // Both sections have matching checks
  // Environment has failed check
  t.is(filtered[0].section, 'Environment')
  t.is(filtered[0].results.length, 1)
  t.is(filtered[0].results[0].id, 'node')
  // Project has warning check
  t.is(filtered[1].section, 'Project')
  t.is(filtered[1].results.length, 1)
  t.is(filtered[1].results[0].id, 'project')
})

test('filterResults excludes empty sections', (t) => {
  const sections = [
    { section: 'A', results: [{ ok: true }] },
    { section: 'B', results: [{ ok: true }] },
  ]
  const filtered = filterResults(sections, { errors: true })
  t.is(filtered.length, 0)
})

// =============================================================================
// getTerminalWidth tests
// =============================================================================

test('getTerminalWidth returns a positive number', (t) => {
  const width = getTerminalWidth()
  t.is(typeof width, 'number')
  t.true(width > 0)
})

test('getTerminalWidth returns at least 80 when not a TTY', (t) => {
  // In test environments stdout is typically not a TTY,
  // so columns is undefined and the fallback (80) is used
  const original = process.stdout.columns
  process.stdout.columns = undefined
  try {
    t.is(getTerminalWidth(), 80)
  } finally {
    process.stdout.columns = original
  }
})

test('getTerminalWidth returns stdout.columns when available', (t) => {
  const original = process.stdout.columns
  process.stdout.columns = 120
  try {
    t.is(getTerminalWidth(), 120)
  } finally {
    process.stdout.columns = original
  }
})
