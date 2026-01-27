/**
 * Stale build check
 *
 * @module lib/doctor/checks/outputs/stale-build
 */
import fs from 'node:fs'
import path from 'node:path'
import { SOURCE_DIRECTORIES } from '#lib/project/index.js'
import config from '#lib/conf/config.js'
import createDebug from '#debug'
import { DOCS_BASE_URL, resolveStaleThreshold } from '../../constants.js'
import { formatDuration } from '../../formatDuration.js'

const debug = createDebug('lib:doctor:stale-build')

/**
 * Get the latest modification time from files in a directory (recursive)
 * @param {string} dir - Directory to scan
 * @returns {number} - Latest modified timestamp in milliseconds, or 0 if directory doesn't exist
 */
function getLatestModified(dir) {
  if (!fs.existsSync(dir)) {
    return 0
  }

  let newest = 0

  const scan = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      try {
        const { mtimeMs: lastModified } = fs.statSync(fullPath)
        if (lastModified > newest) {
          newest = lastModified
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
      level: 'na',
      message: 'No build output found',
      remediation: `Run "quire build" to generate the site.
    • If you already ran "quire build" and it failed, check the output for errors`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#preview-and-build`,
    }
  }

  // Get _site last modified time
  const { mtimeMs: siteLastModified } = fs.statSync(siteDir)
  debug('_site lastModified: %d', siteLastModified)

  // Find newest source file across all source directories
  let newestSourceLastModified = 0
  for (const dir of SOURCE_DIRECTORIES) {
    const lastModified = getLatestModified(dir)
    if (lastModified > newestSourceLastModified) {
      newestSourceLastModified = lastModified
    }
  }
  debug('Newest source lastModified: %d', newestSourceLastModified)

  // If source is newer than build by more than the stale threshold, warn
  const thresholdMs = resolveStaleThreshold(config.get('staleThreshold'))
  const staleDelta = newestSourceLastModified - siteLastModified
  debug('stale delta: %dms, threshold: %dms (%s)', staleDelta, thresholdMs, config.get('staleThreshold'))

  if (staleDelta > thresholdMs) {
    const staleDuration = formatDuration(staleDelta)
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
