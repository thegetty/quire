/**
 * npm availability check
 *
 * @module lib/doctor/checks/environment/npm-available
 */
import npm from '#lib/npm/index.js'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:npm-available')

/**
 * Check npm is available in PATH
 * @returns {Promise<import('../../index.js').CheckResult>}
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

export default checkNpmAvailable
