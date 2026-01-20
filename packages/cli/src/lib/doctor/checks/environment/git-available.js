/**
 * Git availability check
 *
 * @module lib/doctor/checks/environment/git-available
 */
import git from '#lib/git/index.js'
import which from 'which'
import createDebug from '#debug'
import { getPlatform, Platform } from '#lib/platform.js'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:git-available')

/**
 * Get OS-specific Git installation instructions and docs URL
 * @returns {{ remediation: string, docsUrl: string }}
 */
function getRemediationAndDocs() {
  const platform = getPlatform()

  switch (platform) {
    case Platform.MACOS:
      return {
        remediation: `Install Git:
    • Run: xcode-select --install
    • Or using Homebrew: brew install git`,
        docsUrl: `${DOCS_BASE_URL}/install-uninstall/#mac-os-installation`,
      }
    case Platform.WINDOWS:
      return {
        remediation: `Install Git for Windows:
    • Download from: https://git-scm.com/download/win
    • Or using winget: winget install Git.Git
    • Restart your terminal after installation`,
        docsUrl: `${DOCS_BASE_URL}/install-uninstall/#windows-installation`,
      }
    case Platform.LINUX:
      return {
        remediation: `Install Git:
    • Debian/Ubuntu: sudo apt-get install git
    • Fedora: sudo dnf install git
    • Arch: sudo pacman -S git`,
        docsUrl: `${DOCS_BASE_URL}/install-uninstall/#1-install-nodejs`,
      }
    default:
      return {
        remediation: 'Install Git from https://git-scm.com/',
        docsUrl: `${DOCS_BASE_URL}/install-uninstall/`,
      }
  }
}

/**
 * Check Git is available in PATH
 * @returns {Promise<import('../../index.js').CheckResult>}
 */
export async function checkGitAvailable() {
  const ok = await git.isAvailable()
  debug('git available: %s', ok)

  if (ok) {
    const version = await git.version()
    const gitPath = which.sync('git', { nothrow: true })
    return { ok: true, message: version, details: gitPath }
  }

  const { remediation, docsUrl } = getRemediationAndDocs()

  return {
    ok: false,
    message: 'not found in PATH',
    remediation,
    docsUrl,
  }
}

export default checkGitAvailable
