import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('validateDataFiles returns notInProject when data dir does not exist', async (t) => {
  const { sandbox } = t.context

  const { validateDataFiles } = await esmock('./validate-data-files.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(false),
      },
    },
  })

  const result = validateDataFiles()

  t.true(result.valid)
  t.true(result.notInProject)
  t.is(result.fileCount, 0)
  t.deepEqual(result.errors, [])
})

test('validateDataFiles returns error when required file is missing', async (t) => {
  const { sandbox } = t.context

  const existsStub = sandbox.stub()
  existsStub.withArgs('content/_data').returns(true)
  existsStub.withArgs('content/_data/publication.yaml').returns(false)
  existsStub.returns(false)

  const path = await import('node:path')
  const { validateDataFiles } = await esmock('./validate-data-files.js', {
    'node:fs': {
      default: {
        existsSync: existsStub,
        readdirSync: sandbox.stub().returns([]),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = validateDataFiles()

  t.false(result.valid)
  t.true(result.errors.includes('Required file missing: publication.yaml'))
})

test('validateDataFiles validates all YAML files in directory', async (t) => {
  const { sandbox } = t.context

  const existsStub = sandbox.stub()
  existsStub.withArgs('content/_data').returns(true)
  existsStub.withArgs('content/_data/publication.yaml').returns(true)
  existsStub.returns(true)

  const readFileStub = sandbox.stub()
  readFileStub.callsFake((filePath) => {
    if (filePath.includes('publication.yaml')) {
      return 'title: Test Publication'
    }
    if (filePath.includes('config.yaml')) {
      return 'setting: value'
    }
    throw new Error('ENOENT')
  })

  const path = await import('node:path')
  const { validateDataFiles } = await esmock('./validate-data-files.js', {
    'node:fs': {
      default: {
        existsSync: existsStub,
        readdirSync: sandbox.stub().returns(['publication.yaml', 'config.yaml']),
        readFileSync: readFileStub,
      },
    },
    'node:path': {
      default: path.default,
    },
    './utils.js': {
      getSchemaForDocument: sandbox.stub().returns(null),
      checkForDuplicateIds: sandbox.stub(),
    },
  })

  const result = validateDataFiles()

  t.true(result.valid)
  t.is(result.fileCount, 2)
  t.is(result.files.length, 2)
})

test('validateYamlFile returns error for invalid YAML syntax', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { validateYamlFile } = await esmock('./validate-data-files.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        readFileSync: sandbox.stub().returns('title: [invalid yaml'),
      },
    },
    'node:path': {
      default: path.default,
    },
    './utils.js': {
      getSchemaForDocument: sandbox.stub().returns(null),
      checkForDuplicateIds: sandbox.stub(),
    },
  })

  const result = validateYamlFile('content/_data/test.yaml')

  t.false(result.valid)
  t.true(result.errors.some((e) => e.includes('YAML syntax error')))
})

test('validateYamlFile returns error when file not found', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { validateYamlFile } = await esmock('./validate-data-files.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(false),
      },
    },
    'node:path': {
      default: path.default,
    },
  })

  const result = validateYamlFile('content/_data/missing.yaml')

  t.false(result.valid)
  t.true(result.errors.some((e) => e.includes('File not found')))
})

test('validateYamlFile validates against schema when available', async (t) => {
  const { sandbox } = t.context

  const schema = {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
    },
  }

  const path = await import('node:path')
  const { validateYamlFile } = await esmock('./validate-data-files.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        readFileSync: sandbox.stub().returns('notitle: value'),
      },
    },
    'node:path': {
      default: path.default,
    },
    './utils.js': {
      getSchemaForDocument: sandbox.stub().returns(schema),
      checkForDuplicateIds: sandbox.stub(),
    },
  })

  const result = validateYamlFile('content/_data/test.yaml')

  t.false(result.valid)
  t.true(result.errors.some((e) => e.includes('title')))
})

test('validateYamlFile catches duplicate ID errors', async (t) => {
  const { sandbox } = t.context

  const path = await import('node:path')
  const { validateYamlFile } = await esmock('./validate-data-files.js', {
    'node:fs': {
      default: {
        existsSync: sandbox.stub().returns(true),
        readFileSync: sandbox.stub().returns('title: Test'),
      },
    },
    'node:path': {
      default: path.default,
    },
    './utils.js': {
      getSchemaForDocument: sandbox.stub().returns(null),
      checkForDuplicateIds: sandbox.stub().throws({
        reason: 'Duplicate IDs found: fig-1, fig-2',
      }),
    },
  })

  const result = validateYamlFile('content/_data/figures.yaml')

  t.false(result.valid)
  t.true(result.errors.some((e) => e.includes('duplicate IDs')))
})

test('default export is validateDataFiles', async (t) => {
  const module = await import('./validate-data-files.js')

  t.is(typeof module.default, 'function')
  t.is(module.default, module.validateDataFiles)
})
