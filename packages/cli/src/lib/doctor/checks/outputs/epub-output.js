/**
 * EPUB output check
 *
 * Checks for EPUB output files using the same path resolution logic as the
 * EPUB generation command.
 *
 * @module lib/doctor/checks/outputs/epub-output
 */
import fs from 'node:fs'
import path from 'node:path'
import createDebug from '#debug'
import { getEpubOutputPaths } from '#lib/project/output-paths.js'
import config from '#lib/conf/config.js'
import { DOCS_BASE_URL, resolveStaleThreshold } from '../../constants.js'
import { formatDuration } from '../../formatDuration.js'

const debug = createDebug('lib:doctor:epub-output')

/**
 * Check if EPUB output exists and is up to date with _site
 *
 * EPUB output is a final .epub file ({engine}.epub, e.g. epubjs.epub,
 * pandoc.epub). Uses the same path resolution as `commands/epub.js`.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkEpubOutput() {
  const candidatePaths = getEpubOutputPaths()
  debug('candidate EPUB paths: %o', candidatePaths)

  // Find which .epub files actually exist
  const existingEpubs = candidatePaths.filter((p) => fs.existsSync(p))

  // No EPUB output
  if (existingEpubs.length === 0) {
    debug('No EPUB files found')
    return {
      ok: true,
      level: 'na',
      message: 'No EPUB output found',
      remediation: `Run "quire epub" to generate an EPUB.
    • If you already ran "quire epub" and it failed, check the output for errors`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#epub`,
    }
  }

  // Use basenames for display
  const existingNames = existingEpubs.map((p) => path.basename(p))
  debug('found EPUB files: %o', existingNames)

  // Check if _site exists for staleness comparison
  if (!fs.existsSync('_site')) {
    debug('_site directory not found')
    return {
      ok: true,
      message: `${existingNames.join(', ')} exists (no _site to compare)`,
    }
  }

  // Get _site last modified time
  const { mtimeMs: siteLastModified } = fs.statSync('_site')
  debug('_site lastModified: %d', siteLastModified)

  // Check each .epub file for staleness beyond the configured threshold
  const thresholdMs = resolveStaleThreshold(config.get('staleThreshold'))
  const staleFiles = []
  let oldestEpubLastModified = Infinity

  for (const epubFile of existingEpubs) {
    const { mtimeMs: epubLastModified } = fs.statSync(epubFile)
    debug('%s lastModified: %d', path.basename(epubFile), epubLastModified)

    const staleDelta = siteLastModified - epubLastModified
    if (staleDelta > thresholdMs) {
      staleFiles.push(epubFile)
      if (epubLastModified < oldestEpubLastModified) {
        oldestEpubLastModified = epubLastModified
      }
    }
  }

  if (staleFiles.length > 0) {
    const staleDuration = formatDuration(siteLastModified - oldestEpubLastModified)
    const staleNames = staleFiles.map((p) => path.basename(p))
    const fileList = staleNames.join(', ')
    return {
      ok: false,
      level: 'warn',
      message: `${fileList} is ${staleDuration} older than _site`,
      remediation: `Your EPUB may not reflect recent build changes.
    • Run "quire epub" to regenerate the EPUB
    • Or delete the old EPUB files and run "quire epub"`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#epub`,
    }
  }

  // All EPUBs are up to date
  const fileList = existingNames.join(', ')
  return {
    ok: true,
    message: `${fileList} up to date`,
  }
}

export default checkEpubOutput
