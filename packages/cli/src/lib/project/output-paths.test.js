import test from 'ava'
import path from 'node:path'
import { getPdfOutputPaths, getEpubOutputPaths, getEpubBuildDir } from './output-paths.js'

const projectRoot = '/test-project'

test('getPdfOutputPaths returns default engine paths', (t) => {
  const paths = getPdfOutputPaths({ projectRoot })

  t.true(paths.includes(path.join(projectRoot, 'pagedjs.pdf')))
  t.true(paths.includes(path.join(projectRoot, 'prince.pdf')))
})

test('getPdfOutputPaths includes config-aware path when pdfConfig provided', (t) => {
  const pdfConfig = { outputDir: 'pdf', filename: 'my-publication' }
  const paths = getPdfOutputPaths({ projectRoot, outputDir: '_site', pdfConfig })

  // Config path should be first
  t.is(paths[0], path.join(projectRoot, '_site', 'pdf', 'my-publication.pdf'))
  // Default paths should still be present
  t.true(paths.includes(path.join(projectRoot, 'pagedjs.pdf')))
  t.true(paths.includes(path.join(projectRoot, 'prince.pdf')))
})

test('getPdfOutputPaths skips config path when pdfConfig is incomplete', (t) => {
  // Missing filename
  const paths = getPdfOutputPaths({ projectRoot, pdfConfig: { outputDir: 'pdf' } })

  // Should only have default engine paths
  t.is(paths.length, 2)
  t.true(paths.includes(path.join(projectRoot, 'pagedjs.pdf')))
  t.true(paths.includes(path.join(projectRoot, 'prince.pdf')))
})

test('getPdfOutputPaths uses cwd when no projectRoot provided', (t) => {
  const paths = getPdfOutputPaths()

  t.true(paths.includes(path.join(process.cwd(), 'pagedjs.pdf')))
  t.true(paths.includes(path.join(process.cwd(), 'prince.pdf')))
})

test('getEpubOutputPaths returns default engine paths', (t) => {
  const paths = getEpubOutputPaths({ projectRoot })

  t.true(paths.includes(path.join(projectRoot, 'epubjs.epub')))
  t.true(paths.includes(path.join(projectRoot, 'pandoc.epub')))
})

test('getEpubOutputPaths uses cwd when no projectRoot provided', (t) => {
  const paths = getEpubOutputPaths()

  t.true(paths.includes(path.join(process.cwd(), 'epubjs.epub')))
  t.true(paths.includes(path.join(process.cwd(), 'pandoc.epub')))
})

test('getEpubBuildDir returns _epub path', (t) => {
  const dir = getEpubBuildDir({ projectRoot })

  t.is(dir, path.join(projectRoot, '_epub'))
})

test('getEpubBuildDir uses cwd when no projectRoot provided', (t) => {
  const dir = getEpubBuildDir()

  t.is(dir, path.join(process.cwd(), '_epub'))
})
