/**
 * Stale build check
 *
 * @module lib/doctor/checks/outputs/stale-build
 */
import fs from 'node:fs'
import path from 'node:path'
import { SOURCE_DIRECTORIES } from '#lib/project/index.js'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'
import { formatDuration } from '../../formatDuration.js'

const debug = createDebug('lib:doctor:stale-build')

/**
 * Get the latest modification time from files in a directory (recursive)
 * @param {string} dir - Directory to scan
 * @returns {number} - Latest mtime in milliseconds, or 0 if directory doesn't exist
 */
function getLatestMtime(dir) {
  if (!fs.existsSync(dir)) {
    return 0
  }

  let newest = 0

  const scan = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      try {
        const stat = fs.statSync(fullPath)
        if (stat.mtimeMs > newest) {
          newest = stat.mtimeMs
        }
        if (entry.isDirectory()) {
          scan(fullPath)
        }
      } catch {
        // Skip files we can't stat (permissions, etc.)
      }
    }
  }

  scan(dir)
  return newest
}

/**
 * Check if build output is stale (source files newer than _site)
 * @returns {import('../../index.js').CheckResult}
 */
export function checkStaleBuild() {
  const siteDir = '_site'

  // Skip if not in a project or no build output exists
  if (!fs.existsSync(siteDir)) {
    debug('No _site directory found, skipping stale build check')
    return {
      ok: true,
      message: 'No build output yet (run quire build)',
    }
  }

  // Get _site mtime
  const siteStat = fs.statSync(siteDir)
  const siteMtime = siteStat.mtimeMs
  debug('_site mtime: %d', siteMtime)

  // Find newest source file across all source directories
  let newestSourceMtime = 0
  for (const dir of SOURCE_DIRECTORIES) {
    const mtime = getLatestMtime(dir)
    if (mtime > newestSourceMtime) {
      newestSourceMtime = mtime
    }
  }
  debug('Newest source mtime: %d', newestSourceMtime)

  // If source is newer than build, warn about stale build
  if (newestSourceMtime > siteMtime) {
    const staleDuration = formatDuration(newestSourceMtime - siteMtime)
    return {
      ok: false,
      level: 'warn',
      message: `Build output is ${staleDuration} older than source files`,
      remediation: `Your build output may not reflect recent changes.
    • Run "quire build" to regenerate the site
    • Or run "quire preview" which auto-rebuilds on changes`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#preview-and-build`,
    }
  }

  return {
    ok: true,
    message: 'Build output is up to date',
  }
}

export default checkStaleBuild
