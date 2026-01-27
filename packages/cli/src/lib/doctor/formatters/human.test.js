/**
 * Tests for human-readable formatter
 */
import test from 'ava'
import { formatHuman } from './human.js'

const mockSections = [
  {
    section: 'Environment',
    results: [
      { id: 'os', name: 'Operating system', ok: true, message: 'macOS 14' },
      { id: 'node', name: 'Node.js', ok: false, level: 'error', message: 'v18', remediation: 'Upgrade Node.js', docsUrl: 'https://example.com' },
    ],
  },
  {
    section: 'Project',
    results: [
      { id: 'deps', name: 'Dependencies', ok: false, level: 'warn', message: 'Outdated' },
      { id: 'build', name: 'Build', ok: true, level: 'na', message: 'No build yet' },
    ],
  },
]

test('formatHuman returns lines array', (t) => {
  const { lines } = formatHuman(mockSections)
  t.true(Array.isArray(lines))
  t.true(lines.length > 0)
})

test('formatHuman lines have text and level properties', (t) => {
  const { lines } = formatHuman(mockSections)
  for (const line of lines) {
    t.true(typeof line.text === 'string')
    t.true(['info', 'warn', 'error'].includes(line.level))
  }
})

test('formatHuman includes header with label', (t) => {
  const { lines } = formatHuman(mockSections, { label: 'environment checks' })
  const header = lines[0]
  t.true(header.text.includes('Running environment checks'))
})

test('formatHuman includes section names', (t) => {
  const { lines } = formatHuman(mockSections)
  const sectionLines = lines.filter((l) => l.text === 'Environment' || l.text === 'Project')
  t.is(sectionLines.length, 2)
})

test('formatHuman includes check names and messages', (t) => {
  const { lines } = formatHuman(mockSections)
  const osLine = lines.find((l) => l.text.includes('Operating system'))
  t.truthy(osLine)
  t.true(osLine.text.includes('macOS 14'))
})

test('formatHuman returns summary with error count and N/A count', (t) => {
  const { summary } = formatHuman(mockSections)
  t.truthy(summary)
  t.true(summary.text.includes('1 check failed'))
  t.true(summary.text.includes('(1 not applicable)'))
  t.is(summary.level, 'error')
})

test('formatHuman returns exitCode 1 when checks fail', (t) => {
  const { exitCode } = formatHuman(mockSections)
  t.is(exitCode, 1)
})

test('formatHuman returns exitCode 0 when all pass', (t) => {
  const healthySections = [
    { section: 'Env', results: [{ id: 'os', name: 'OS', ok: true }] },
  ]
  const { exitCode } = formatHuman(healthySections)
  t.is(exitCode, 0)
})

test('formatHuman includes remediation for failed checks', (t) => {
  const { lines } = formatHuman(mockSections)
  const remediationLine = lines.find((l) => l.text.includes('How to fix'))
  t.truthy(remediationLine)
})

test('formatHuman includes docsUrl for failed checks', (t) => {
  const { lines } = formatHuman(mockSections)
  const docsLine = lines.find((l) => l.text.includes('Documentation:'))
  t.truthy(docsLine)
  t.true(docsLine.text.includes('https://example.com'))
})

test('formatHuman with errors filter shows only failed', (t) => {
  const { lines, isEmpty } = formatHuman(mockSections, { errors: true })
  t.false(isEmpty)
  // Should not include passed or warning checks
  const osLine = lines.find((l) => l.text.includes('Operating system'))
  t.falsy(osLine)
  const nodeLine = lines.find((l) => l.text.includes('Node.js'))
  t.truthy(nodeLine)
})

test('formatHuman with warnings filter shows only warnings', (t) => {
  const { lines, isEmpty } = formatHuman(mockSections, { warnings: true })
  t.false(isEmpty)
  const depsLine = lines.find((l) => l.text.includes('Dependencies'))
  t.truthy(depsLine)
})

test('formatHuman returns isEmpty true when filter excludes all', (t) => {
  const healthySections = [
    { section: 'Env', results: [{ id: 'os', name: 'OS', ok: true }] },
  ]
  const { isEmpty, lines } = formatHuman(healthySections, { errors: true })
  t.true(isEmpty)
  t.true(lines[0].text.includes('No failed checks'))
})

test('formatHuman returns key in default mode', (t) => {
  const { key } = formatHuman(mockSections, {})
  t.truthy(key)
  t.true(key.text.includes('Key:'))
  t.true(key.text.includes('passed'))
  t.true(key.text.includes('failed'))
})

test('formatHuman returns key without verbose', (t) => {
  const { key } = formatHuman(mockSections, { verbose: false })
  t.truthy(key)
  t.true(key.text.includes('Key:'))
})

test('formatHuman hides key when --errors filter is active', (t) => {
  const { key } = formatHuman(mockSections, { errors: true })
  t.is(key, null)
})

test('formatHuman hides key when --warnings filter is active', (t) => {
  const { key } = formatHuman(mockSections, { warnings: true })
  t.is(key, null)
})

test('formatHuman includes details in verbose mode', (t) => {
  const sectionsWithDetails = [
    {
      section: 'Env',
      results: [
        { id: 'os', name: 'OS', ok: true, message: 'macOS', details: '/usr/bin/sw_vers' },
      ],
    },
  ]
  const { lines } = formatHuman(sectionsWithDetails, { verbose: true })
  const detailsLine = lines.find((l) => l.text.includes('/usr/bin/sw_vers'))
  t.truthy(detailsLine)
})

test('formatHuman excludes details without verbose', (t) => {
  const sectionsWithDetails = [
    {
      section: 'Env',
      results: [
        { id: 'os', name: 'OS', ok: true, message: 'macOS', details: '/usr/bin/sw_vers' },
      ],
    },
  ]
  const { lines } = formatHuman(sectionsWithDetails, { verbose: false })
  const detailsLine = lines.find((l) => l.text.includes('/usr/bin/sw_vers'))
  t.falsy(detailsLine)
})

test('formatHuman assigns correct log levels to lines', (t) => {
  const { lines } = formatHuman(mockSections)
  // Failed check should have error level
  const nodeLine = lines.find((l) => l.text.includes('Node.js'))
  t.is(nodeLine.level, 'error')
  // Warning check should have warn level
  const depsLine = lines.find((l) => l.text.includes('Dependencies'))
  t.is(depsLine.level, 'warn')
  // Passed check should have info level
  const osLine = lines.find((l) => l.text.includes('Operating system'))
  t.is(osLine.level, 'info')
})

test('formatHuman handles timeout status', (t) => {
  const sectionsWithTimeout = [
    {
      section: 'Env',
      results: [
        { id: 'npm', name: 'npm', ok: false, level: 'timeout', message: 'Timed out' },
      ],
    },
  ]
  const { lines, summary } = formatHuman(sectionsWithTimeout)
  const npmLine = lines.find((l) => l.text.includes('npm'))
  t.truthy(npmLine)
  t.is(npmLine.level, 'warn')
  t.true(summary.text.includes('1 timed out'))
})

test('formatHuman summary shows warnings without errors', (t) => {
  const warningSections = [
    {
      section: 'Project',
      results: [
        { id: 'deps', name: 'Dependencies', ok: false, level: 'warn', message: 'Outdated' },
      ],
    },
  ]
  const { summary, exitCode } = formatHuman(warningSections)
  t.true(summary.text.includes('All checks passed with 1 warning'))
  t.is(summary.level, 'warn')
  t.is(exitCode, 0)
})

// ─────────────────────────────────────────────────────────────────────────────
// N/A count in summary
// ─────────────────────────────────────────────────────────────────────────────

test('formatHuman summary includes N/A count when all checks pass', (t) => {
  const sections = [
    {
      section: 'Outputs',
      results: [
        { id: 'build', name: 'Build', ok: true, message: 'Up to date' },
        { id: 'pdf', name: 'PDF', ok: true, level: 'na', message: 'No PDF output' },
        { id: 'epub', name: 'EPUB', ok: true, level: 'na', message: 'No EPUB output' },
      ],
    },
  ]
  const { summary } = formatHuman(sections)
  t.true(summary.text.includes('All checks passed!'))
  t.true(summary.text.includes('(2 not applicable)'))
})

test('formatHuman summary includes N/A count with warnings', (t) => {
  const sections = [
    {
      section: 'Outputs',
      results: [
        { id: 'build', name: 'Build', ok: false, level: 'warn', message: 'Stale' },
        { id: 'pdf', name: 'PDF', ok: true, level: 'na', message: 'No PDF output' },
      ],
    },
  ]
  const { summary } = formatHuman(sections)
  t.true(summary.text.includes('All checks passed with 1 warning'))
  t.true(summary.text.includes('(1 not applicable)'))
})

test('formatHuman summary omits N/A count when none exist', (t) => {
  const sections = [
    {
      section: 'Env',
      results: [
        { id: 'os', name: 'OS', ok: true, message: 'macOS' },
      ],
    },
  ]
  const { summary } = formatHuman(sections)
  t.true(summary.text.includes('All checks passed!'))
  t.false(summary.text.includes('not applicable'))
})

test('formatHuman summary includes singular N/A count', (t) => {
  const sections = [
    {
      section: 'Outputs',
      results: [
        { id: 'build', name: 'Build', ok: true, message: 'Up to date' },
        { id: 'pdf', name: 'PDF', ok: true, level: 'na', message: 'No PDF output' },
      ],
    },
  ]
  const { summary } = formatHuman(sections)
  t.true(summary.text.includes('(1 not applicable)'))
})
