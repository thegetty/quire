/**
 * Doctor module - diagnostic checks for Quire environment
 *
 * @module lib/doctor
 */
import createDebug from '#debug'

// Import checks from domain submodules
import {
  checkOsInfo,
  checkCliVersion,
  checkNodeVersion,
  checkNpmAvailable,
  checkGitAvailable,
  checkPrinceAvailable,
} from './checks/environment/index.js'

import {
  checkQuireProject,
  checkDependencies,
  checkOutdatedQuire11ty,
  checkDataFiles,
} from './checks/project/index.js'

import {
  checkStaleBuild,
  checkPdfOutput,
  checkEpubOutput,
} from './checks/outputs/index.js'

// Re-export constants
export { DOCS_BASE_URL, REQUIRED_NODE_VERSION, QUIRE_11TY_PACKAGE } from './constants.js'

// Re-export individual checks
export {
  // Environment
  checkOsInfo,
  checkCliVersion,
  checkNodeVersion,
  checkNpmAvailable,
  checkGitAvailable,
  checkPrinceAvailable,
  // Project
  checkQuireProject,
  checkDependencies,
  checkOutdatedQuire11ty,
  checkDataFiles,
  // Outputs
  checkStaleBuild,
  checkPdfOutput,
  checkEpubOutput,
}

const debug = createDebug('lib:doctor')

/**
 * Default timeout for async checks (in milliseconds)
 * Prevents hanging checks from blocking the doctor command
 */
export const DEFAULT_CHECK_TIMEOUT = 10_000 // 10 seconds

/**
 * Check result type
 * @typedef {Object} CheckResult
 * @property {boolean} ok - Whether the check passed
 * @property {'error'|'warn'|'na'|'timeout'} [level] - Severity level (default: 'error')
 * @property {string|null} message - Optional message with details
 * @property {string|null} [details] - Additional details (shown in verbose mode)
 * @property {string|null} [remediation] - Steps to fix the issue (when ok is false)
 * @property {string|null} [docsUrl] - Link to relevant documentation (when ok is false)
 */

/**
 * Run a check function with a timeout
 * @param {Function} checkFn - The check function to run
 * @param {string} checkId - ID of the check (for error messages)
 * @param {number} [timeout=DEFAULT_CHECK_TIMEOUT] - Timeout in milliseconds
 * @returns {Promise<CheckResult>}
 */
async function runCheckWithTimeout(checkFn, checkId, timeout = DEFAULT_CHECK_TIMEOUT) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Check '${checkId}' timed out after ${timeout}ms`))
    }, timeout)
  })

  try {
    return await Promise.race([checkFn(), timeoutPromise])
  } catch (error) {
    debug('Check %s failed with error: %s', checkId, error.message)
    return {
      ok: false,
      level: 'timeout',
      message: `skipped (timed out after ${timeout}ms)`,
      remediation: `The '${checkId}' check is taking too long to complete. This may indicate a network issue or a problem with the tool being checked.`,
    }
  }
}

/**
 * All available diagnostic checks organized by section
 * Each check has an `id` for CLI filtering (short, lowercase, hyphenated)
 */
export const checkSections = [
  {
    name: 'Environment',
    checks: [
      { id: 'os', name: 'Operating system', check: checkOsInfo },
      { id: 'cli', name: 'Quire CLI version', check: checkCliVersion },
      { id: 'node', name: 'Node.js version', check: checkNodeVersion },
      { id: 'npm', name: 'npm', check: checkNpmAvailable },
      { id: 'git', name: 'Git', check: checkGitAvailable },
      { id: 'prince', name: 'PrinceXML', check: checkPrinceAvailable },
    ],
  },
  {
    name: 'Project',
    checks: [
      { id: 'project', name: 'Quire project', check: checkQuireProject },
      { id: 'deps', name: 'Dependencies', check: checkDependencies },
      { id: '11ty', name: 'quire-11ty version', check: checkOutdatedQuire11ty },
      { id: 'data', name: 'Data files', check: checkDataFiles },
    ],
  },
  {
    name: 'Outputs',
    checks: [
      { id: 'build', name: 'Build status', check: checkStaleBuild },
      { id: 'pdf', name: 'PDF output', check: checkPdfOutput },
      { id: 'epub', name: 'EPUB output', check: checkEpubOutput },
    ],
  },
]

/**
 * Valid check IDs for filtering individual checks
 */
export const CHECK_IDS = checkSections.flatMap((s) => s.checks.map((c) => c.id))

/**
 * All available diagnostic checks (flat list for backwards compatibility)
 */
export const checks = [
  { name: 'Operating system', check: checkOsInfo },
  { name: 'Quire CLI version', check: checkCliVersion },
  { name: 'Node.js version', check: checkNodeVersion },
  { name: 'npm', check: checkNpmAvailable },
  { name: 'Git', check: checkGitAvailable },
  { name: 'PrinceXML', check: checkPrinceAvailable },
  { name: 'Quire project', check: checkQuireProject },
  { name: 'Dependencies', check: checkDependencies },
  { name: 'quire-11ty version', check: checkOutdatedQuire11ty },
  { name: 'Data files', check: checkDataFiles },
  { name: 'Build status', check: checkStaleBuild },
  { name: 'PDF output', check: checkPdfOutput },
  { name: 'EPUB output', check: checkEpubOutput },
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
 * Valid section names for filtering
 */
export const SECTION_NAMES = ['environment', 'project', 'outputs']

/**
 * Run all diagnostic checks organized by section
 * @param {Object} [options] - Filter options
 * @param {string[]} [options.sections] - Optional array of section names to run (lowercase)
 * @param {string[]} [options.checks] - Optional array of check IDs to run
 * @param {number} [options.timeout] - Timeout in milliseconds for each check (default: DEFAULT_CHECK_TIMEOUT)
 * @returns {Promise<Array<{section: string, results: Array<{id: string, name: string, ok: boolean, message: string|null}>}>>}
 */
export async function runAllChecksWithSections(options = {}) {
  const {
    sections: filterSections = null,
    checks: filterChecks = null,
    timeout = DEFAULT_CHECK_TIMEOUT,
  } = options

  // Handle legacy call signature: runAllChecksWithSections(['environment'])
  const sectionsFilter = Array.isArray(options) ? options : filterSections

  debug('Running diagnostic checks with sections, filter: %o, checks: %o, timeout: %d', sectionsFilter, filterChecks, timeout)
  const sections = []

  for (const { name: sectionName, checks: sectionChecks } of checkSections) {
    // Skip sections not in filter (if section filter is provided and no check filter)
    if (sectionsFilter && !filterChecks && !sectionsFilter.includes(sectionName.toLowerCase())) {
      continue
    }

    const results = []
    for (const { id, name, check } of sectionChecks) {
      // Skip checks not in filter (if check filter is provided)
      if (filterChecks && !filterChecks.includes(id)) {
        continue
      }

      const result = await runCheckWithTimeout(check, id, timeout)
      results.push({ id, name, ...result })
    }

    // Only include section if it has results
    if (results.length > 0) {
      sections.push({ section: sectionName, results })
    }
  }

  return sections
}

export default {
  checks,
  checkSections,
  checkCliVersion,
  checkDataFiles,
  checkDependencies,
  checkEpubOutput,
  checkGitAvailable,
  checkNodeVersion,
  checkNpmAvailable,
  checkOsInfo,
  checkOutdatedQuire11ty,
  checkPdfOutput,
  checkPrinceAvailable,
  checkQuireProject,
  checkStaleBuild,
  runAllChecks,
  runAllChecksWithSections,
  CHECK_IDS,
  SECTION_NAMES,
  DEFAULT_CHECK_TIMEOUT,
}
