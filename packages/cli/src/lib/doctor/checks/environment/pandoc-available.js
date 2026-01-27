/**
 * Pandoc availability check
 *
 * Checks if Pandoc is installed and available in PATH.
 * Pandoc is an optional EPUB engine - only required when using --engine pandoc.
 *
 * @module lib/doctor/checks/environment/pandoc-available
 */
import which from 'which'
import createDebug from '#debug'
import { getPlatform, Platform } from '#lib/platform.js'
import { DOCS_BASE_URL } from '#lib/doctor/constants.js'

const debug = createDebug('lib:doctor:pandoc-available')

/**
 * Get pandoc binary path if available
 * @returns {string|null} Path to pandoc binary or null if not found
 */
function getPandocPath() {
  return which.sync('pandoc', { nothrow: true })
}

/**
 * Get OS-specific Pandoc installation instructions
 * @returns {string}
 */
function getRemediation() {
  const platform = getPlatform()

  switch (platform) {
    case Platform.MACOS:
      return `Pandoc is optional (only needed for --engine pandoc).
    • Install via Homebrew: brew install pandoc
    • Or download from: https://pandoc.org/installing.html`
    case Platform.WINDOWS:
      return `Pandoc is optional (only needed for --engine pandoc).
    • Install via winget: winget install --source winget --exact --id JohnMacFarlane.Pandoc
    • Or download from: https://pandoc.org/installing.html
    • Restart your terminal after installation`
    case Platform.LINUX:
      return `Pandoc is optional (only needed for --engine pandoc).
    • Install via package manager: apt install pandoc / dnf install pandoc
    • Or download from: https://pandoc.org/installing.html`
    default:
      return `Pandoc is optional (only needed for --engine pandoc).
    • Download from: https://pandoc.org/installing.html`
  }
}

/**
 * Check Pandoc is available in PATH
 *
 * This is an optional check - Pandoc is only required when using
 * the --engine pandoc option for EPUB generation. The default engine
 * (epubjs) does not require Pandoc.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkPandocAvailable() {
  const pandocPath = getPandocPath()
  const ok = !!pandocPath
  debug('pandoc available: %s', ok)

  if (ok) {
    return {
      ok: true,
      message: 'installed',
      details: pandocPath,
    }
  }

  return {
    ok: false,
    level: 'warn',
    message: 'not found (optional)',
    remediation: getRemediation(),
    docsUrl: `${DOCS_BASE_URL}/quire-commands/#epub`,
  }
}

export default checkPandocAvailable
