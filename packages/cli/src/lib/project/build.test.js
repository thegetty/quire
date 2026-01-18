import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import esmock from 'esmock'

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
    '/project/_site/index.html': '<html></html>',
  })

  const { hasSiteOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasSiteOutput('/project'))
})

test('hasSiteOutput returns false when _site does not exist', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/.quire': '',
  })

  const { hasSiteOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.false(hasSiteOutput('/project'))
})

test('hasEpubOutput returns true when _epub exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/_epub/content.opf': '<package></package>',
  })

  const { hasEpubOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasEpubOutput('/project'))
})

test('hasEpubOutput returns false when _epub does not exist', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/.quire': '',
  })

  const { hasEpubOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.false(hasEpubOutput('/project'))
})

test('getBuildInfo returns correct status for existing builds', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/_site/index.html': '<html></html>',
    '/project/_epub/content.opf': '<package></package>',
  })

  const { getBuildInfo } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const info = getBuildInfo('/project')

  t.true(info.site.exists)
  t.is(info.site.path, '/project/_site')
  t.truthy(info.site.mtime)

  t.true(info.epub.exists)
  t.is(info.epub.path, '/project/_epub')
  t.truthy(info.epub.mtime)
})

test('getBuildInfo returns correct status for missing builds', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/.quire': '',
  })

  const { getBuildInfo } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const info = getBuildInfo('/project')

  t.false(info.site.exists)
  t.is(info.site.mtime, null)

  t.false(info.epub.exists)
  t.is(info.epub.mtime, null)
})

test('requireBuildOutput throws when site output missing', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/.quire': '',
  })

  const { requireBuildOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const error = t.throws(() => {
    requireBuildOutput({ type: 'site', projectRoot: '/project' })
  })

  t.is(error.code, 'ENOBUILD')
  t.regex(error.message, /quire build/)
})

test('requireBuildOutput throws when epub output missing', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/.quire': '',
  })

  const { requireBuildOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  const error = t.throws(() => {
    requireBuildOutput({ type: 'epub', projectRoot: '/project' })
  })

  t.is(error.code, 'ENOBUILD')
})

test('requireBuildOutput does not throw when output exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/_site/index.html': '<html></html>',
    '/project/_epub/content.opf': '<package></package>',
  })

  const { requireBuildOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.notThrows(() => {
    requireBuildOutput({ type: 'site', projectRoot: '/project' })
  })

  t.notThrows(() => {
    requireBuildOutput({ type: 'epub', projectRoot: '/project' })
  })
})

test('hasPdfOutput returns true when specific lib PDF exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/pagedjs.pdf': '%PDF-1.4',
  })

  const { hasPdfOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasPdfOutput({ lib: 'pagedjs', projectRoot: '/project' }))
  t.false(hasPdfOutput({ lib: 'prince', projectRoot: '/project' }))
})

test('hasPdfOutput returns false when no PDF exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/.quire': '',
  })

  const { hasPdfOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.false(hasPdfOutput({ projectRoot: '/project' }))
})

test('hasPdfOutput returns true when any common PDF exists', async (t) => {
  const { vol } = t.context

  vol.fromJSON({
    '/project/prince.pdf': '%PDF-1.4',
  })

  const { hasPdfOutput } = await esmock('./build.js', {
    'node:fs': createFsFromVolume(vol),
  })

  t.true(hasPdfOutput({ projectRoot: '/project' }))
})
