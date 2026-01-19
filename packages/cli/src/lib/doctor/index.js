/**
 * Doctor module - diagnostic checks for Quire environment
 *
 * @module lib/doctor
 */
import createDebug from '#debug'

// Import checks from domain submodules
import {
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
 */
export const checkSections = [
  {
    name: 'Environment',
    checks: [
      { name: 'Quire CLI version', check: checkCliVersion },
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
      { name: 'quire-11ty version', check: checkOutdatedQuire11ty },
      { name: 'Data files', check: checkDataFiles },
    ],
  },
  {
    name: 'Outputs',
    checks: [
      { name: 'Build status', check: checkStaleBuild },
      { name: 'PDF output', check: checkPdfOutput },
      { name: 'EPUB output', check: checkEpubOutput },
    ],
  },
]

/**
 * All available diagnostic checks (flat list for backwards compatibility)
 */
export const checks = [
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
  checkCliVersion,
  checkDataFiles,
  checkDependencies,
  checkEpubOutput,
  checkGitAvailable,
  checkNodeVersion,
  checkNpmAvailable,
  checkOutdatedQuire11ty,
  checkPdfOutput,
  checkQuireProject,
  checkStaleBuild,
  runAllChecks,
  runAllChecksWithSections,
}
