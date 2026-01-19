/**
 * Node.js version check
 *
 * @module lib/doctor/checks/environment/node-version
 */
import createDebug from '#debug'
import { DOCS_BASE_URL, REQUIRED_NODE_VERSION } from '../../constants.js'

const debug = createDebug('lib:doctor:node-version')

/**
 * Check Node.js version meets minimum requirement
 * @returns {import('../../index.js').CheckResult}
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

export default checkNodeVersion
