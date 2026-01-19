/**
 * Data files validation check
 *
 * @module lib/doctor/checks/project/data-files
 */
import { DATA_DIR } from '#lib/project/index.js'
import { validateDataFiles } from '#src/validators/validate-data-files.js'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:data-files')

/**
 * Check data files in content/_data/ for YAML syntax and schema validation
 *
 * Validates:
 * - Required files exist (publication.yaml)
 * - YAML syntax is correct
 * - Files conform to their JSON schemas (when schema exists)
 * - No duplicate IDs in arrays
 *
 * @returns {import('../../index.js').CheckResult}
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

export default checkDataFiles
