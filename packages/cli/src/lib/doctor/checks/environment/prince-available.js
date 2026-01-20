/**
 * PrinceXML availability check
 *
 * Checks if PrinceXML is installed and available in PATH.
 * PrinceXML is an optional PDF engine - only required when using --engine prince.
 *
 * @module lib/doctor/checks/environment/prince-available
 */
import which from 'which'
import createDebug from '#debug'
import { getPlatform, Platform } from '#lib/platform.js'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:prince-available')

/**
 * Get prince binary path if available
 * @returns {string|null} Path to prince binary or null if not found
 */
function getPrincePath() {
  return which.sync('prince', { nothrow: true })
}

/**
 * Get OS-specific PrinceXML installation instructions
 * @returns {string}
 */
function getRemediation() {
  const platform = getPlatform()

  switch (platform) {
    case Platform.MACOS:
      return `PrinceXML is optional (only needed for --engine prince).
    • Download from: https://www.princexml.com/download/
    • Or install via Homebrew: brew install --cask prince`
    case Platform.WINDOWS:
      return `PrinceXML is optional (only needed for --engine prince).
    • Download from: https://www.princexml.com/download/
    • Restart your terminal after installation`
    case Platform.LINUX:
      return `PrinceXML is optional (only needed for --engine prince).
    • Download from: https://www.princexml.com/download/
    • Follow platform-specific installation instructions`
    default:
      return `PrinceXML is optional (only needed for --engine prince).
    • Download from: https://www.princexml.com/download/`
  }
}

/**
 * Check PrinceXML is available in PATH
 *
 * This is an optional check - PrinceXML is only required when using
 * the --engine prince option for PDF generation. The default engine
 * (Paged.js) does not require PrinceXML.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkPrinceAvailable() {
  const princePath = getPrincePath()
  const ok = !!princePath
  debug('prince available: %s', ok)

  if (ok) {
    return {
      ok: true,
      message: 'installed',
      details: princePath,
    }
  }

  return {
    ok: false,
    level: 'warn',
    message: 'not found (optional)',
    remediation: getRemediation(),
    docsUrl: `${DOCS_BASE_URL}/quire-commands/#pdf`,
  }
}

export default checkPrinceAvailable
