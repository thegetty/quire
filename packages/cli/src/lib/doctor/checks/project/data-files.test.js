import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkDataFiles returns N/A when no data directory exists', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./data-files.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: true,
        errors: [],
        fileCount: 0,
        files: [],
        notInProject: true,
      }),
    },
  })

  const result = checkDataFiles()

  t.true(result.ok)
  t.is(result.level, 'na')
  t.regex(result.message, /No content\/_data directory/)
})

test('checkDataFiles returns ok when all YAML files are valid', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./data-files.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: true,
        errors: [],
        fileCount: 1,
        files: [{ file: 'publication.yaml', valid: true, errors: [] }],
      }),
    },
  })

  const result = checkDataFiles()

  t.true(result.ok)
  t.regex(result.message, /1 files validated/)
})

test('checkDataFiles returns warning when required file is missing', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./data-files.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: false,
        errors: ['Required file missing: publication.yaml'],
        fileCount: 0,
        files: [],
      }),
    },
  })

  const result = checkDataFiles()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.message, /1 issue/)
  t.regex(result.remediation, /publication\.yaml/)
})

test('checkDataFiles returns warning when YAML has syntax error', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./data-files.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: false,
        errors: ['invalid.yaml: YAML syntax error at line 1 - unexpected end of stream'],
        fileCount: 2,
        files: [
          { file: 'publication.yaml', valid: true, errors: [] },
          { file: 'invalid.yaml', valid: false, errors: ['invalid.yaml: YAML syntax error at line 1 - unexpected end of stream'] },
        ],
      }),
    },
  })

  const result = checkDataFiles()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.remediation, /invalid\.yaml/)
  t.regex(result.remediation, /YAML syntax error/)
})

test('checkDataFiles returns warning when duplicate IDs exist', async (t) => {
  const { sandbox } = t.context

  const { checkDataFiles } = await esmock('./data-files.js', {
    '#src/validators/validate-data-files.js': {
      validateDataFiles: sandbox.stub().returns({
        valid: false,
        errors: ['figures.yaml: duplicate IDs found: fig-1'],
        fileCount: 2,
        files: [
          { file: 'publication.yaml', valid: true, errors: [] },
          { file: 'figures.yaml', valid: false, errors: ['figures.yaml: duplicate IDs found: fig-1'] },
        ],
      }),
    },
  })

  const result = checkDataFiles()

  t.false(result.ok)
  t.is(result.level, 'warn')
  t.regex(result.remediation, /duplicate IDs/)
  t.regex(result.remediation, /fig-1/)
})
