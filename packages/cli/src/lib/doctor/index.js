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
 * Check result type
 * @typedef {Object} CheckResult
 * @property {boolean} ok - Whether the check passed
 * @property {'error'|'warn'} [level] - Severity level (default: 'error')
 * @property {string|null} message - Optional message with details
 * @property {string|null} [remediation] - Steps to fix the issue (when ok is false)
 * @property {string|null} [docsUrl] - Link to relevant documentation (when ok is false)
 */

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
      { id: 'npm', name: 'npm available', check: checkNpmAvailable },
      { id: 'git', name: 'Git available', check: checkGitAvailable },
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
  { name: 'npm available', check: checkNpmAvailable },
  { name: 'Git available', check: checkGitAvailable },
  { name: 'Quire project detected', check: checkQuireProject },
  { name: 'Dependencies installed', check: checkDependencies },
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
 * @returns {Promise<Array<{section: string, results: Array<{name: string, ok: boolean, message: string|null}>}>>}
 */
export async function runAllChecksWithSections(options = {}) {
  const { sections: filterSections = null, checks: filterChecks = null } = options

  // Handle legacy call signature: runAllChecksWithSections(['environment'])
  const sectionsFilter = Array.isArray(options) ? options : filterSections

  debug('Running diagnostic checks with sections, filter: %o, checks: %o', sectionsFilter, filterChecks)
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

      const result = await check()
      results.push({ name, ...result })
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
  checkQuireProject,
  checkStaleBuild,
  runAllChecks,
  runAllChecksWithSections,
  CHECK_IDS,
  SECTION_NAMES,
}
