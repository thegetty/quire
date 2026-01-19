/**
 * Quire CLI version check
 *
 * @module lib/doctor/checks/environment/cli-version
 */
import updateNotifier from 'update-notifier'
import packageConfig from '#src/packageConfig.js'
import config from '#lib/conf/config.js'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:cli-version')

/**
 * Check Quire CLI version and report if an update is available
 *
 * Uses the cached update info from update-notifier (which checks in background
 * on CLI startup) to avoid blocking the doctor command with network requests.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkCliVersion() {
  const current = packageConfig.version
  debug('Current CLI version: %s', current)

  // Access cached update info from update-notifier
  // Using a high updateCheckInterval prevents triggering a new check,
  // we just want to read the cached result from the CLI startup check
  const updateChannel = config.get('updateChannel') || 'rc'
  const notifier = updateNotifier({
    pkg: packageConfig,
    distTag: updateChannel,
    updateCheckInterval: Number.MAX_SAFE_INTEGER, // Don't trigger new check
  })

  debug('Cached update info: %o', notifier.update)

  // Check if an update is available
  if (notifier.update && notifier.update.latest !== current) {
    const { latest } = notifier.update
    debug('Update available: %s -> %s', current, latest)

    return {
      ok: false,
      level: 'warn',
      message: `v${current} installed, v${latest} available`,
      remediation: `Update Quire CLI to the latest version:
    • npm install -g @thegetty/quire-cli@${latest}
    • Or update via your package manager if installed differently`,
      docsUrl: `${DOCS_BASE_URL}/install-uninstall/`,
    }
  }

  // No update info or already up to date
  const upToDateSuffix = notifier.update ? ' (up to date)' : ''
  return {
    ok: true,
    message: `v${current}${upToDateSuffix}`,
  }
}

export default checkCliVersion
