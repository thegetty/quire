/**
 * Tests for JSON formatter
 */
import test from 'ava'
import { formatJson } from './json.js'

const mockSections = [
  {
    section: 'Environment',
    results: [
      { id: 'os', name: 'Operating system', ok: true, message: 'macOS 14' },
      { id: 'node', name: 'Node.js', ok: false, level: 'error', message: 'v18 (requires v22)', remediation: 'Upgrade Node.js', docsUrl: 'https://example.com/docs' },
    ],
  },
  {
    section: 'Project',
    results: [
      { id: 'deps', name: 'Dependencies', ok: false, level: 'warn', message: 'Outdated' },
      { id: 'build', name: 'Build', ok: true, level: 'na', message: 'No build yet' },
      { id: 'data', name: 'Data', ok: false, level: 'timeout', message: 'Timed out' },
    ],
  },
]

test('formatJson returns valid JSON string', (t) => {
  const { json } = formatJson(mockSections)
  t.notThrows(() => JSON.parse(json))
})

test('formatJson includes summary counts', (t) => {
  const { json } = formatJson(mockSections)
  const output = JSON.parse(json)
  t.deepEqual(output.summary, {
    passed: 1,
    failed: 1,
    warnings: 1,
    timeouts: 1,
    na: 1,
    total: 5,
  })
})

test('formatJson includes all results with correct structure', (t) => {
  const { json } = formatJson(mockSections)
  const output = JSON.parse(json)
  t.is(output.results.length, 5)

  const osCheck = output.results.find((c) => c.id === 'os')
  t.deepEqual(osCheck, {
    id: 'os',
    name: 'Operating system',
    section: 'Environment',
    status: 'passed',
    message: 'macOS 14',
  })
})

test('formatJson includes remediation and docsUrl for failed checks', (t) => {
  const { json } = formatJson(mockSections)
  const output = JSON.parse(json)

  const nodeCheck = output.results.find((c) => c.id === 'node')
  t.is(nodeCheck.remediation, 'Upgrade Node.js')
  t.is(nodeCheck.docsUrl, 'https://example.com/docs')
})

test('formatJson returns exitCode 1 when checks fail', (t) => {
  const { exitCode } = formatJson(mockSections)
  t.is(exitCode, 1)
})

test('formatJson returns exitCode 0 when no checks fail', (t) => {
  const healthySections = [
    {
      section: 'Environment',
      results: [{ id: 'os', name: 'OS', ok: true }],
    },
  ]
  const { exitCode } = formatJson(healthySections)
  t.is(exitCode, 0)
})

test('formatJson with errors filter includes only failed checks', (t) => {
  const { json } = formatJson(mockSections, { errors: true })
  const output = JSON.parse(json)
  t.is(output.results.length, 1)
  t.is(output.results[0].id, 'node')
  t.is(output.results[0].status, 'failed')
})

test('formatJson with warnings filter includes only warning checks', (t) => {
  const { json } = formatJson(mockSections, { warnings: true })
  const output = JSON.parse(json)
  t.is(output.results.length, 1)
  t.is(output.results[0].id, 'deps')
  t.is(output.results[0].status, 'warning')
})

test('formatJson summary reflects unfiltered counts when --errors filter is active', (t) => {
  const { json, exitCode } = formatJson(mockSections, { errors: true })
  const output = JSON.parse(json)
  // results array is filtered to errors only
  t.is(output.results.length, 1)
  // summary counts reflect all results
  t.is(output.summary.passed, 1)
  t.is(output.summary.failed, 1)
  t.is(output.summary.warnings, 1)
  t.is(output.summary.total, 5)
  t.is(exitCode, 1)
})

test('formatJson summary reflects unfiltered counts when --warnings filter is active', (t) => {
  const { json, exitCode } = formatJson(mockSections, { warnings: true })
  const output = JSON.parse(json)
  // results array is filtered to warnings only
  t.is(output.results.length, 1)
  // summary counts reflect all results, including the error
  t.is(output.summary.failed, 1)
  t.is(output.summary.warnings, 1)
  t.is(output.summary.total, 5)
  t.is(exitCode, 1)
})

test('formatJson omits filter property when no filter is active', (t) => {
  const { json } = formatJson(mockSections)
  const output = JSON.parse(json)
  t.is(output.filter, undefined)
})

test('formatJson includes filter property with --errors', (t) => {
  const { json } = formatJson(mockSections, { errors: true })
  const output = JSON.parse(json)
  t.deepEqual(output.filter, ['errors'])
})

test('formatJson includes filter property with --warnings', (t) => {
  const { json } = formatJson(mockSections, { warnings: true })
  const output = JSON.parse(json)
  t.deepEqual(output.filter, ['warnings'])
})

test('formatJson includes filter property with both --errors and --warnings', (t) => {
  const { json } = formatJson(mockSections, { errors: true, warnings: true })
  const output = JSON.parse(json)
  t.deepEqual(output.filter, ['errors', 'warnings'])
})

test('formatJson with verbose includes details', (t) => {
  const sectionsWithDetails = [
    {
      section: 'Environment',
      results: [
        { id: 'os', name: 'OS', ok: true, message: 'macOS', details: '/usr/bin' },
      ],
    },
  ]
  const { json } = formatJson(sectionsWithDetails, { verbose: true })
  const output = JSON.parse(json)
  t.is(output.results[0].details, '/usr/bin')
})

test('formatJson without verbose excludes details', (t) => {
  const sectionsWithDetails = [
    {
      section: 'Environment',
      results: [
        { id: 'os', name: 'OS', ok: true, message: 'macOS', details: '/usr/bin' },
      ],
    },
  ]
  const { json } = formatJson(sectionsWithDetails, { verbose: false })
  const output = JSON.parse(json)
  t.is(output.results[0].details, undefined)
})
