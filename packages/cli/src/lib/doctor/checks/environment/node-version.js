/**
 * Node.js version check
 *
 * @module lib/doctor/checks/environment/node-version
 */
import createDebug from '#debug'
import { getPlatform, Platform } from '#lib/platform.js'
import { DOCS_BASE_URL, REQUIRED_NODE_VERSION } from '../../constants.js'

const debug = createDebug('lib:doctor:node-version')

/**
 * Get OS-specific Node.js installation instructions
 * @returns {string}
 */
function getRemediation() {
  const platform = getPlatform()
  const version = REQUIRED_NODE_VERSION

  switch (platform) {
    case Platform.MACOS:
      return `Install Node.js ${version} or later:
    • Using nvm (recommended): nvm install ${version} && nvm use ${version}
    • Using Homebrew: brew install node@${version}
    • Download from: https://nodejs.org/`
    case Platform.WINDOWS:
      return `Install Node.js ${version} or later:
    • Using nvm-windows: nvm install ${version} && nvm use ${version}
    • Download installer from: https://nodejs.org/
    • Using winget: winget install OpenJS.NodeJS.LTS`
    case Platform.LINUX:
      return `Install Node.js ${version} or later:
    • Using nvm (recommended): nvm install ${version} && nvm use ${version}
    • Using apt (Debian/Ubuntu): See https://nodejs.org/en/download/package-manager
    • Download from: https://nodejs.org/`
    default:
      return `Install Node.js ${version} or later from https://nodejs.org/`
  }
}

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
    remediation: getRemediation(),
    docsUrl: `${DOCS_BASE_URL}/install-uninstall/#1-install-nodejs`,
  }
}

export default checkNodeVersion
