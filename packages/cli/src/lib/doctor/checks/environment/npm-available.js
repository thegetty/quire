/**
 * npm availability check
 *
 * @module lib/doctor/checks/environment/npm-available
 */
import npm from '#lib/npm/index.js'
import createDebug from '#debug'
import { getPlatform, Platform } from '#lib/platform.js'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:npm-available')

/**
 * Get OS-specific npm troubleshooting instructions
 * @returns {string}
 */
function getRemediation() {
  const platform = getPlatform()
  const commonSteps = `npm is included with Node.js. Ensure Node.js is properly installed:
    • Verify installation: node --version`

  switch (platform) {
    case Platform.MACOS:
      return `${commonSteps}
    • If using nvm, run: nvm use default
    • Reinstall Node.js: brew reinstall node (or download from nodejs.org)`
    case Platform.WINDOWS:
      return `${commonSteps}
    • Restart your terminal after Node.js installation
    • Check PATH includes: %APPDATA%\\npm
    • Reinstall Node.js from: https://nodejs.org/`
    case Platform.LINUX:
      return `${commonSteps}
    • If using nvm, run: nvm use default
    • Check PATH includes Node.js bin directory
    • Reinstall Node.js from: https://nodejs.org/`
    default:
      return `${commonSteps}
    • Reinstall Node.js if needed: https://nodejs.org/`
  }
}

/**
 * Check npm is available in PATH
 * @returns {Promise<import('../../index.js').CheckResult>}
 */
export async function checkNpmAvailable() {
  const ok = await npm.isAvailable()
  debug('npm available: %s', ok)

  if (ok) {
    const version = await npm.version()
    return { ok: true, message: version }
  }

  return {
    ok: false,
    message: 'not found in PATH',
    remediation: getRemediation(),
    docsUrl: `${DOCS_BASE_URL}/install-uninstall/#1-install-nodejs`,
  }
}

export default checkNpmAvailable
