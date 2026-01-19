/**
 * Git availability check
 *
 * @module lib/doctor/checks/environment/git-available
 */
import git from '#lib/git/index.js'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:git-available')

/**
 * Check Git is available in PATH
 * @returns {Promise<import('../../index.js').CheckResult>}
 */
export async function checkGitAvailable() {
  const ok = await git.isAvailable()
  debug('git available: %s', ok)

  if (ok) {
    return { ok: true, message: null }
  }

  return {
    ok: false,
    message: 'Git not found in PATH',
    remediation: `Install Git for your operating system:
    • macOS: xcode-select --install (or brew install git)
    • Windows: Download from https://git-scm.com/download/win
    • Linux: sudo apt-get install git (Debian/Ubuntu)`,
    docsUrl: `${DOCS_BASE_URL}/install-uninstall/#mac-os-installation`,
  }
}

export default checkGitAvailable
