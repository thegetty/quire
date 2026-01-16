import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import esmock from 'esmock'

test.beforeEach((t) => {
  // Create in-memory file system
  t.context.vol = new Volume()
  t.context.fs = createFsFromVolume(t.context.vol)
})

test.afterEach.always((t) => {
  // Clear in-memory file system
  t.context.vol.reset()
})

// ─────────────────────────────────────────────────────────────────────────────
// getVersion tests
// ─────────────────────────────────────────────────────────────────────────────

test('getVersion should read version from project version file', async (t) => {
  const { fs, vol } = t.context

  vol.fromJSON({
    '/project/.quire': '1.0.0'
  })

  const { getVersion } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  const result = getVersion('/project')

  t.is(result, '1.0.0', 'should return version string')
})

test('getVersion should use default project root when not provided', async (t) => {
  const { fs, vol } = t.context

  vol.fromJSON({
    '/default/project/.quire': '2.0.0'
  })

  const { getVersion } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/default/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  const result = getVersion()

  t.is(result, '2.0.0', 'should use default project root')
})

// ─────────────────────────────────────────────────────────────────────────────
// setVersion tests
// ─────────────────────────────────────────────────────────────────────────────

test('setVersion should create version file with quire11ty field', async (t) => {
  const { fs, vol } = t.context

  vol.fromJSON({
    '/project/.gitkeep': ''
  })

  const { setVersion } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts),
      writeFileSync: (p, data) => fs.writeFileSync(p, data)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  setVersion('1.5.0', '/project')

  const written = fs.readFileSync('/project/.quire', 'utf8')
  const parsed = JSON.parse(written)

  t.is(parsed.quire11ty, '1.5.0', 'should write version to quire11ty field')
})

test('setVersion should preserve existing version file metadata', async (t) => {
  const { fs, vol } = t.context

  const existingData = JSON.stringify({
    cli: '1.0.0',
    starter: 'https://example.com/starter@1.0.0',
    quire11ty: '1.0.0'
  })

  vol.fromJSON({
    '/project/.quire': existingData
  })

  const { setVersion } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts),
      writeFileSync: (p, data) => fs.writeFileSync(p, data)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  setVersion('2.0.0', '/project')

  const written = fs.readFileSync('/project/.quire', 'utf8')
  const parsed = JSON.parse(written)

  t.is(parsed.quire11ty, '2.0.0', 'should update quire11ty version')
  t.is(parsed.cli, '1.0.0', 'should preserve cli version')
  t.is(parsed.starter, 'https://example.com/starter@1.0.0', 'should preserve starter info')
})

test('setVersion should handle legacy plain text version file', async (t) => {
  const { fs, vol } = t.context

  // Legacy format: just a version string, not JSON
  vol.fromJSON({
    '/project/.quire': '1.0.0-legacy'
  })

  const { setVersion } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts),
      writeFileSync: (p, data) => fs.writeFileSync(p, data)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  setVersion('2.0.0', '/project')

  const written = fs.readFileSync('/project/.quire', 'utf8')
  const parsed = JSON.parse(written)

  t.is(parsed.quire11ty, '2.0.0', 'should migrate to new JSON format')
})

test('setVersion should use default project root when not provided', async (t) => {
  const { fs, vol } = t.context

  vol.fromJSON({
    '/default/project/.gitkeep': ''
  })

  const { setVersion } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts),
      writeFileSync: (p, data) => fs.writeFileSync(p, data)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/default/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  setVersion('3.0.0')

  const written = fs.readFileSync('/default/project/.quire', 'utf8')
  const parsed = JSON.parse(written)

  t.is(parsed.quire11ty, '3.0.0', 'should use default project root')
})

// ─────────────────────────────────────────────────────────────────────────────
// getVersionsFromStarter tests
// ─────────────────────────────────────────────────────────────────────────────

test('getVersionsFromStarter should read versions from package.json', async (t) => {
  const { fs, vol } = t.context

  const packageJson = JSON.stringify({
    name: 'quire-starter-default',
    version: '1.2.3',
    peerDependencies: {
      '@thegetty/quire-11ty': '^1.0.0'
    }
  })

  vol.fromJSON({
    '/project/package.json': packageJson
  })

  const { getVersionsFromStarter } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: () => '.quire' }
    }
  })

  const result = await getVersionsFromStarter('/project')

  t.is(result.quire11tyVersion, '^1.0.0', 'should return quire-11ty version range')
  t.is(result.starterVersion, '1.2.3', 'should return starter version')
})

// ─────────────────────────────────────────────────────────────────────────────
// writeVersionFile tests
// ─────────────────────────────────────────────────────────────────────────────

test('writeVersionFile should write JSON to version file', async (t) => {
  const { fs, vol } = t.context

  vol.fromJSON({
    '/project/.gitkeep': ''
  })

  const { writeVersionFile } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts),
      writeFileSync: (p, data) => fs.writeFileSync(p, data)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  const versionInfo = { cli: '1.0.0', starter: 'test@1.0.0' }
  writeVersionFile('/project', versionInfo)

  const written = fs.readFileSync('/project/.quire', 'utf8')
  const parsed = JSON.parse(written)

  t.deepEqual(parsed, versionInfo, 'should write version info as JSON')
})

// ─────────────────────────────────────────────────────────────────────────────
// readVersionFile tests
// ─────────────────────────────────────────────────────────────────────────────

test('readVersionFile should return null when file does not exist', async (t) => {
  const { fs, vol } = t.context

  vol.fromJSON({
    '/project/.gitkeep': ''
  })

  const { readVersionFile } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  const result = readVersionFile('/project')

  t.is(result, null, 'should return null when file does not exist')
})

test('readVersionFile should parse JSON version file', async (t) => {
  const { fs, vol } = t.context

  const versionInfo = { cli: '1.0.0', quire11ty: '1.5.0' }
  vol.fromJSON({
    '/project/.quire': JSON.stringify(versionInfo)
  })

  const { readVersionFile } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  const result = readVersionFile('/project')

  t.deepEqual(result, versionInfo, 'should parse and return version info')
})

test('readVersionFile should handle legacy plain text format', async (t) => {
  const { fs, vol } = t.context

  // Legacy format: plain version string
  vol.fromJSON({
    '/project/.quire': '1.0.0-legacy'
  })

  const { readVersionFile } = await esmock('./version.js', {
    'fs-extra': {
      existsSync: (p) => fs.existsSync(p),
      readFileSync: (p, opts) => fs.readFileSync(p, opts)
    },
    './paths.js': {
      default: { getProjectRoot: () => '/project' }
    },
    '#lib/conf/config.js': {
      default: { get: (key) => key === 'versionFile' ? '.quire' : null }
    }
  })

  const result = readVersionFile('/project')

  t.deepEqual(result, { version: '1.0.0-legacy' }, 'should return legacy format as object')
})
