import test from 'ava'
import path from 'node:path'
import { Volume, createFsFromVolume } from 'memfs'
import esmock from 'esmock'

/**
 * Helper to create cross-platform paths for memfs
 * memfs uses forward slashes internally, but we need to pass
 * platform-native paths to the functions under test
 */
const testRoot = '/test-project'
const nativePath = (...segments) => path.join(testRoot, ...segments)
const memfsPath = (...segments) => [testRoot, ...segments].join('/')

test.beforeEach((t) => {
  // Create in-memory file system
  t.context.vol = new Volume()
  t.context.fs = createFsFromVolume(t.context.vol)
})

test.afterEach.always((t) => {
  t.context.vol.reset()
})

test('hasSiteOutput returns true when _site exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('_site', 'index.html')]: '<html></html>',
  })

  const { hasSiteOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasSiteOutput(testRoot))
})

test('hasSiteOutput returns false when _site does not exist', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('.quire')]: '',
  })

  const { hasSiteOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.false(hasSiteOutput(testRoot))
})

test('hasEpubOutput returns true when _epub exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('_epub', 'content.opf')]: '<package></package>',
  })

  const { hasEpubOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasEpubOutput(testRoot))
})

test('hasEpubOutput returns false when _epub does not exist', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('.quire')]: '',
  })

  const { hasEpubOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.false(hasEpubOutput(testRoot))
})

test('getBuildInfo returns correct status for existing builds', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('_site', 'index.html')]: '<html></html>',
    [memfsPath('_epub', 'content.opf')]: '<package></package>',
    [memfsPath('pagedjs.pdf')]: '%PDF-1.4',
  })

  const { getBuildInfo } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const info = getBuildInfo(testRoot)

  t.true(info.site.exists)
  t.is(info.site.path, nativePath('_site'))
  t.truthy(info.site.mtime)

  t.true(info.epub.exists)
  t.is(info.epub.path, nativePath('_epub'))
  t.truthy(info.epub.mtime)

  t.true(info.pdf.exists)
  t.deepEqual(info.pdf.paths, [nativePath('pagedjs.pdf')])
  t.truthy(info.pdf.mtime)
})

test('getBuildInfo returns correct status for missing builds', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('.quire')]: '',
  })

  const { getBuildInfo } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const info = getBuildInfo(testRoot)

  t.false(info.site.exists)
  t.is(info.site.mtime, null)

  t.false(info.epub.exists)
  t.is(info.epub.mtime, null)

  t.false(info.pdf.exists)
  t.deepEqual(info.pdf.paths, [])
  t.is(info.pdf.mtime, null)
})

test('getBuildInfo returns multiple PDF paths when both exist', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('pagedjs.pdf')]: '%PDF-1.4',
    [memfsPath('prince.pdf')]: '%PDF-1.4',
  })

  const { getBuildInfo } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const info = getBuildInfo(testRoot)

  t.true(info.pdf.exists)
  t.is(info.pdf.paths.length, 2)
  t.true(info.pdf.paths.includes(nativePath('pagedjs.pdf')))
  t.true(info.pdf.paths.includes(nativePath('prince.pdf')))
  t.truthy(info.pdf.mtime)
})

test('requireBuildOutput throws when site output missing', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('.quire')]: '',
  })

  const { requireBuildOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const error = t.throws(() => {
    requireBuildOutput({ type: 'site', projectRoot: testRoot })
  })

  t.is(error.code, 'ENOBUILD')
  t.regex(error.message, /quire build/)
})

test('requireBuildOutput throws when epub output missing', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('.quire')]: '',
  })

  const { requireBuildOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const error = t.throws(() => {
    requireBuildOutput({ type: 'epub', projectRoot: testRoot })
  })

  t.is(error.code, 'ENOBUILD')
})

test('requireBuildOutput does not throw when output exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('_site', 'index.html')]: '<html></html>',
    [memfsPath('_epub', 'content.opf')]: '<package></package>',
  })

  const { requireBuildOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.notThrows(() => {
    requireBuildOutput({ type: 'site', projectRoot: testRoot })
  })

  t.notThrows(() => {
    requireBuildOutput({ type: 'epub', projectRoot: testRoot })
  })
})

test('hasPdfOutput returns true when specific lib PDF exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('pagedjs.pdf')]: '%PDF-1.4',
  })

  const { hasPdfOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasPdfOutput({ lib: 'pagedjs', projectRoot: testRoot }))
  t.false(hasPdfOutput({ lib: 'prince', projectRoot: testRoot }))
})

test('hasPdfOutput returns false when no PDF exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('.quire')]: '',
  })

  const { hasPdfOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.false(hasPdfOutput({ projectRoot: testRoot }))
})

test('hasPdfOutput returns true when any common PDF exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    [memfsPath('prince.pdf')]: '%PDF-1.4',
  })

  const { hasPdfOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasPdfOutput({ projectRoot: testRoot }))
})
