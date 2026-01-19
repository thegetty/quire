/**
 * Doctor module - diagnostic checks for Quire environment
 *
 * @module lib/doctor
 */
import fs from 'node:fs'
import path from 'node:path'
import git from '#lib/git/index.js'
import npm from '#lib/npm/index.js'
import { DATA_DIR, PROJECT_MARKERS, SOURCE_DIRECTORIES } from '#lib/project/index.js'
import { validateDataFiles } from '#src/validators/validate-data-files.js'
import createDebug from '#debug'
import { formatDuration } from './formatDuration.js'

const debug = createDebug('lib:doctor')

/**
 * Base URL for Quire documentation
 */
const DOCS_BASE_URL = 'https://quire.getty.edu/docs-v1'

/**
 * Minimum required Node.js major version
 */
const REQUIRED_NODE_VERSION = 22

/**
 * Check result type
 * @typedef {Object} CheckResult
 * @property {boolean} ok - Whether the check passed
 * @property {'error'|'warn'} [level] - Severity level (default: 'error')
 * @property {string|null} message - Optional message with details
 * @property {string|null} [remediation] - Steps to fix the issue (when ok is false)
 * @property {string|null} [docsUrl] - Link to relevant documentation (when ok is false)
 */

/**
 * Check Node.js version meets minimum requirement
 * @returns {CheckResult}
 */
export function checkNodeVersion() {
  const current = parseInt(process.version.slice(1), 10)
  const ok = current >= REQUIRED_NODE_VERSION
  debug('Node.js version check: %s (required >= %d)', process.version, REQUIRED_NODE_VERSION)

  if (ok) {
    return {
      ok: true,
      message: `v${process.version.slice(1)} (>= ${REQUIRED_NODE_VERSION} required)`,
    }
  }

  return {
    ok: false,
    message: `v${process.version.slice(1)} found, but >= ${REQUIRED_NODE_VERSION} required`,
    remediation: `Install Node.js ${REQUIRED_NODE_VERSION} or later:
    • Using nvm: nvm install ${REQUIRED_NODE_VERSION} && nvm use ${REQUIRED_NODE_VERSION}
    • Using Homebrew (macOS): brew install node@${REQUIRED_NODE_VERSION}
    • Download from: https://nodejs.org/`,
    docsUrl: `${DOCS_BASE_URL}/install-uninstall/#1-install-nodejs`,
  }
}

/**
 * Check npm is available in PATH
 * @returns {Promise<CheckResult>}
 */
export async function checkNpmAvailable() {
  const ok = await npm.isAvailable()
  debug('npm available: %s', ok)

  if (ok) {
    return { ok: true, message: null }
  }

  return {
    ok: false,
    message: 'npm not found in PATH',
    remediation: `npm is included with Node.js. Ensure Node.js is properly installed:
    • Verify installation: node --version
    • Reinstall Node.js if needed: https://nodejs.org/
    • Check your PATH environment variable includes the Node.js bin directory`,
    docsUrl: `${DOCS_BASE_URL}/install-uninstall/#1-install-nodejs`,
  }
}

/**
 * Check Git is available in PATH
 * @returns {Promise<CheckResult>}
 */
export async function checkGitAvailable() {
  const ok = await git.isAvailable()
  debug('git available: %s', ok)

  if (ok) {
    return { ok: true, message: null }
  }

  return {
    ok: false,
    message: 'Git not found in PATH',
    remediation: `Install Git for your operating system:
    • macOS: xcode-select --install (or brew install git)
    • Windows: Download from https://git-scm.com/download/win
    • Linux: sudo apt-get install git (Debian/Ubuntu)`,
    docsUrl: `${DOCS_BASE_URL}/install-uninstall/#mac-os-installation`,
  }
}

/**
 * Check if current directory is a Quire project
 * @returns {CheckResult}
 */
export function checkQuireProject() {
  const found = PROJECT_MARKERS.find((marker) => fs.existsSync(marker))
  debug('Quire project marker: %s', found || 'none')

  if (found) {
    return {
      ok: true,
      message: `Detected via ${found}`,
    }
  }

  return {
    ok: false,
    message: 'No Quire project marker found',
    remediation: `This command should be run from within a Quire project directory.
    • Navigate to your project: cd your-project-name
    • Or create a new project: quire new my-project`,
    docsUrl: `${DOCS_BASE_URL}/quire-commands/#start-a-new-project`,
  }
}

/**
 * Check if dependencies are installed
 * @returns {CheckResult}
 */
export function checkDependencies() {
  const hasPackageJson = fs.existsSync('package.json')
  const hasNodeModules = fs.existsSync('node_modules')

  debug('package.json exists: %s, node_modules exists: %s', hasPackageJson, hasNodeModules)

  if (!hasPackageJson) {
    return {
      ok: true,
      message: 'No package.json (not in project directory)',
    }
  }

  if (!hasNodeModules) {
    return {
      ok: false,
      message: 'node_modules not found',
      remediation: `Install project dependencies by running:
    • npm install

    If you continue to have issues:
    • Delete node_modules folder and package-lock.json, then run npm install again
    • Ensure you have write permissions in the project directory`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#install-dependencies`,
    }
  }

  return {
    ok: true,
    message: null,
  }
}

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
 * @returns {CheckResult}
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

/**
 * Check data files in content/_data/ for YAML syntax and schema validation
 *
 * Validates:
 * - Required files exist (publication.yaml)
 * - YAML syntax is correct
 * - Files conform to their JSON schemas (when schema exists)
 * - No duplicate IDs in arrays
 *
 * @returns {CheckResult}
 */
export function checkDataFiles() {
  const result = validateDataFiles()

  // Not in a project directory
  if (result.notInProject) {
    debug('No %s directory found, skipping data files check', DATA_DIR)
    return {
      ok: true,
      message: `No ${DATA_DIR} directory (not in project)`,
    }
  }

  debug('Found %d YAML files in %s', result.fileCount, DATA_DIR)

  if (!result.valid) {
    const issueCount = result.errors.length === 1 ? '1 issue' : `${result.errors.length} issues`
    return {
      ok: false,
      level: 'warn',
      message: `${issueCount} in data files`,
      remediation: `Fix the following issues in ${DATA_DIR}:\n    • ${result.errors.join('\n    • ')}`,
      docsUrl: `${DOCS_BASE_URL}/metadata-configuration/`,
    }
  }

  return {
    ok: true,
    message: `${result.fileCount} files validated`,
  }
}

/**
 * All available diagnostic checks organized by section
 */
export const checkSections = [
  {
    name: 'Environment',
    checks: [
      { name: 'Node.js version', check: checkNodeVersion },
      { name: 'npm available', check: checkNpmAvailable },
      { name: 'Git available', check: checkGitAvailable },
    ],
  },
  {
    name: 'Project',
    checks: [
      { name: 'Quire project', check: checkQuireProject },
      { name: 'Dependencies', check: checkDependencies },
      { name: 'Data files', check: checkDataFiles },
      { name: 'Build status', check: checkStaleBuild },
    ],
  },
]

/**
 * All available diagnostic checks (flat list for backwards compatibility)
 */
export const checks = [
  { name: 'Node.js version', check: checkNodeVersion },
  { name: 'npm available', check: checkNpmAvailable },
  { name: 'Git available', check: checkGitAvailable },
  { name: 'Quire project detected', check: checkQuireProject },
  { name: 'Dependencies installed', check: checkDependencies },
  { name: 'Data files', check: checkDataFiles },
  { name: 'Build status', check: checkStaleBuild },
]

/**
 * Run all diagnostic checks (flat list)
 * @returns {Promise<Array<{name: string, ok: boolean, message: string|null}>>}
 */
export async function runAllChecks() {
  debug('Running all diagnostic checks')
  const results = []

  for (const { name, check } of checks) {
    const result = await check()
    results.push({ name, ...result })
  }

  return results
}

/**
 * Run all diagnostic checks organized by section
 * @returns {Promise<Array<{section: string, results: Array<{name: string, ok: boolean, message: string|null}>}>>}
 */
export async function runAllChecksWithSections() {
  debug('Running all diagnostic checks with sections')
  const sections = []

  for (const { name: sectionName, checks: sectionChecks } of checkSections) {
    const results = []
    for (const { name, check } of sectionChecks) {
      const result = await check()
      results.push({ name, ...result })
    }
    sections.push({ section: sectionName, results })
  }

  return sections
}

export default {
  checks,
  checkSections,
  checkDataFiles,
  checkDependencies,
  checkGitAvailable,
  checkNodeVersion,
  checkNpmAvailable,
  checkQuireProject,
  checkStaleBuild,
  runAllChecks,
  runAllChecksWithSections,
}
