/**
 * Quire project detection check
 *
 * @module lib/doctor/checks/project/quire-project
 */
import fs from 'node:fs'
import { PROJECT_MARKERS } from '#lib/project/index.js'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '#lib/doctor/constants.js'

const debug = createDebug('lib:doctor:quire-project')

/**
 * Check if current directory is a Quire project
 * @returns {import('../../index.js').CheckResult}
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

export default checkQuireProject
