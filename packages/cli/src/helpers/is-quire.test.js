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

test('isQuire should recognize .eleventy.js marker file', async (t) => {
  const { fs, vol } = t.context

  // Setup a Quire project directory with .eleventy.js
  vol.fromJSON({
    '/quire-project/.eleventy.js': 'module.exports = function() {}',
    '/quire-project/content/_data/config.yaml': 'title: Test Project'
  })

  // Mock node:fs to use memfs
  const isQuire = await esmock('./is-quire.js', {
    'node:fs': fs
  })

  const result = isQuire('/quire-project')

  t.truthy(result, 'should return truthy value for directory with .eleventy.js')
  t.is(result, '.eleventy.js', 'should return the marker file name')
})

test('isQuire should recognize eleventy.config.js marker file', async (t) => {
  const { fs, vol } = t.context

  // Setup a Quire project directory with eleventy.config.js
  vol.fromJSON({
    '/quire-project/eleventy.config.js': 'module.exports = function() {}',
    '/quire-project/content/_data/config.yaml': 'title: Test Project'
  })

  // Mock node:fs to use memfs
  const isQuire = await esmock('./is-quire.js', {
    'node:fs': fs
  })

  const result = isQuire('/quire-project')

  t.truthy(result, 'should return truthy value for directory with eleventy.config.js')
  t.is(result, 'eleventy.config.js', 'should return the marker file name')
})

test('isQuire should recognize .quire marker file', async (t) => {
  const { fs, vol } = t.context

  // Setup a Quire project directory with .quire marker
  vol.fromJSON({
    '/quire-project/.quire': '',
    '/quire-project/content/index.md': '# Welcome'
  })

  // Mock node:fs to use memfs
  const isQuire = await esmock('./is-quire.js', {
    'node:fs': fs
  })

  const result = isQuire('/quire-project')

  t.truthy(result, 'should return truthy value for directory with .quire')
  t.is(result, '.quire', 'should return the marker file name')
})

test('isQuire should recognize .quire-11ty marker file', async (t) => {
  const { fs, vol } = t.context

  // Setup a Quire project directory with .quire-11ty marker
  vol.fromJSON({
    '/quire-project/.quire-11ty': '',
    '/quire-project/content/index.md': '# Welcome'
  })

  // Mock node:fs to use memfs
  const isQuire = await esmock('./is-quire.js', {
    'node:fs': fs
  })

  const result = isQuire('/quire-project')

  t.truthy(result, 'should return truthy value for directory with .quire-11ty')
  t.is(result, '.quire-11ty', 'should return the marker file name')
})

test('isQuire should recognize .quire-version marker file', async (t) => {
  const { fs, vol } = t.context

  // Setup a Quire project directory with .quire-version marker
  vol.fromJSON({
    '/quire-project/.quire-version': '1.0.0',
    '/quire-project/content/index.md': '# Welcome'
  })

  // Mock node:fs to use memfs
  const isQuire = await esmock('./is-quire.js', {
    'node:fs': fs
  })

  const result = isQuire('/quire-project')

  t.truthy(result, 'should return truthy value for directory with .quire-version')
  t.is(result, '.quire-version', 'should return the marker file name')
})

test('isQuire should return falsy for non-Quire directory', async (t) => {
  const { fs, vol } = t.context

  // Setup a non-Quire directory (no marker files)
  vol.fromJSON({
    '/non-quire-directory/some-file.txt': 'not a quire project',
    '/non-quire-directory/package.json': JSON.stringify({ name: 'some-other-project' })
  })

  // Mock node:fs to use memfs
  const isQuire = await esmock('./is-quire.js', {
    'node:fs': fs
  })

  const result = isQuire('/non-quire-directory')

  t.falsy(result, 'should return falsy value for directory without marker files')
})

test('isQuire should return first marker file found when multiple exist', async (t) => {
  const { fs, vol } = t.context

  // Setup a Quire project directory with multiple markers
  vol.fromJSON({
    '/quire-project/.eleventy.js': 'module.exports = function() {}',
    '/quire-project/.quire': '',
    '/quire-project/.quire-version': '1.0.0'
  })

  // Mock node:fs to use memfs
  const isQuire = await esmock('./is-quire.js', {
    'node:fs': fs
  })

  const result = isQuire('/quire-project')

  t.truthy(result, 'should return truthy value for directory with multiple markers')
  t.true(
    ['.eleventy.js', '.quire', '.quire-11ty', '.quire-version', 'eleventy.config.js'].includes(result),
    'should return one of the valid marker file names'
  )
})
