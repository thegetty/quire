/**
 * Doctor module - diagnostic checks for Quire environment
 *
 * @module lib/doctor
 */
import fs from 'node:fs'
import git from '#lib/git/index.js'
import npm from '#lib/npm/index.js'
import createDebug from '#debug'

const debug = createDebug('lib:doctor')

/**
 * Minimum required Node.js major version
 */
const REQUIRED_NODE_VERSION = 22

/**
 * Files that indicate a Quire project directory
 */
const PROJECT_MARKERS = ['.quire', '.quire-version', '.eleventy.js', 'eleventy.config.js']

/**
 * Check result type
 * @typedef {Object} CheckResult
 * @property {boolean} ok - Whether the check passed
 * @property {string|null} message - Optional message with details
 */

/**
 * Check Node.js version meets minimum requirement
 * @returns {CheckResult}
 */
export function checkNodeVersion() {
  const current = parseInt(process.version.slice(1), 10)
  const ok = current >= REQUIRED_NODE_VERSION
  debug('Node.js version check: %s (required >= %d)', process.version, REQUIRED_NODE_VERSION)
  return {
    ok,
    message: ok
      ? `v${process.version.slice(1)} (>= ${REQUIRED_NODE_VERSION} required)`
      : `v${process.version.slice(1)} found, but >= ${REQUIRED_NODE_VERSION} required`,
  }
}

/**
 * Check npm is available in PATH
 * @returns {Promise<CheckResult>}
 */
export async function checkNpmAvailable() {
  const ok = await npm.isAvailable()
  debug('npm available: %s', ok)
  return {
    ok,
    message: ok ? null : 'npm not found in PATH',
  }
}

/**
 * Check Git is available in PATH
 * @returns {Promise<CheckResult>}
 */
export async function checkGitAvailable() {
  const ok = await git.isAvailable()
  debug('git available: %s', ok)
  return {
    ok,
    message: ok ? null : 'Git not found in PATH',
  }
}

/**
 * Check if current directory is a Quire project
 * @returns {CheckResult}
 */
export function checkQuireProject() {
  const found = PROJECT_MARKERS.find((marker) => fs.existsSync(marker))
  debug('Quire project marker: %s', found || 'none')
  return {
    ok: !!found,
    message: found
      ? `Detected via ${found}`
      : 'No Quire project marker found. Run from a Quire project directory.',
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
      message: 'node_modules not found. Run "npm install" to install dependencies.',
    }
  }

  return {
    ok: true,
    message: null,
  }
}

/**
 * All available diagnostic checks
 */
export const checks = [
  { name: 'Node.js version', check: checkNodeVersion },
  { name: 'npm available', check: checkNpmAvailable },
  { name: 'Git available', check: checkGitAvailable },
  { name: 'Quire project detected', check: checkQuireProject },
  { name: 'Dependencies installed', check: checkDependencies },
]

/**
 * Run all diagnostic checks
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

export default {
  checks,
  checkDependencies,
  checkGitAvailable,
  checkNodeVersion,
  checkNpmAvailable,
  checkQuireProject,
  runAllChecks,
}
