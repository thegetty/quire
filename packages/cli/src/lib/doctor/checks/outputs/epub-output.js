/**
 * EPUB output check
 *
 * @module lib/doctor/checks/outputs/epub-output
 */
import fs from 'node:fs'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'
import { formatDuration } from '../../formatDuration.js'

const debug = createDebug('lib:doctor:epub-output')

/**
 * EPUB output directory
 */
const EPUB_DIR = '_epub'

/**
 * Check if EPUB output exists and is up to date with _site
 *
 * EPUB is generated from _site, so if _site is newer than _epub,
 * the EPUB is considered stale.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkEpubOutput() {
  // Check if _epub directory exists
  if (!fs.existsSync(EPUB_DIR)) {
    debug('No _epub directory found')
    return {
      ok: true,
      message: 'No EPUB output (run quire epub to generate)',
    }
  }

  debug('Found _epub directory')

  // Check if _site exists
  if (!fs.existsSync('_site')) {
    debug('_site directory not found')
    return {
      ok: true,
      message: '_epub exists (no _site to compare)',
    }
  }

  // Get modification times
  const siteStat = fs.statSync('_site')
  const siteMtime = siteStat.mtimeMs
  debug('_site mtime: %d', siteMtime)

  const epubStat = fs.statSync(EPUB_DIR)
  const epubMtime = epubStat.mtimeMs
  debug('_epub mtime: %d', epubMtime)

  // If _site is newer than _epub, warn about stale EPUB
  if (siteMtime > epubMtime) {
    const staleDuration = formatDuration(siteMtime - epubMtime)
    return {
      ok: false,
      level: 'warn',
      message: `_epub is ${staleDuration} older than _site`,
      remediation: `Your EPUB may not reflect recent build changes.
    • Run "quire epub" to regenerate the EPUB
    • Or delete the _epub directory and run "quire epub"`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#epub`,
    }
  }

  return {
    ok: true,
    message: '_epub up to date',
  }
}

export default checkEpubOutput
