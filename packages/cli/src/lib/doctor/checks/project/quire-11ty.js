/**
 * quire-11ty version check
 *
 * @module lib/doctor/checks/project/quire-11ty
 */
import fs from 'node:fs'
import path from 'node:path'
import semver from 'semver'
import npm from '#lib/npm/index.js'
import config from '#lib/conf/config.js'
import createDebug from '#debug'
import { DOCS_BASE_URL, QUIRE_11TY_PACKAGE } from '#lib/doctor/constants.js'

const debug = createDebug('lib:doctor:quire-11ty')

/**
 * Check if quire-11ty is outdated compared to the latest available version
 *
 * Compares the installed version of @thegetty/quire-11ty against the latest
 * version available on npm (using the configured updateChannel, e.g., 'rc').
 *
 * @returns {Promise<import('../../index.js').CheckResult>}
 */
export async function checkOutdatedQuire11ty() {
  const packagePath = path.join('node_modules', QUIRE_11TY_PACKAGE, 'package.json')

  // Skip if quire-11ty is not installed
  if (!fs.existsSync(packagePath)) {
    debug('quire-11ty not installed, skipping outdated check')
    return {
      ok: true,
      level: 'na',
      message: 'quire-11ty not installed (not in project)',
    }
  }

  // Read installed version
  let installedVersion
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    installedVersion = packageJson.version
    debug('Installed quire-11ty version: %s', installedVersion)
  } catch (error) {
    debug('Failed to read installed quire-11ty version: %s', error.message)
    return {
      ok: false,
      level: 'warn',
      message: 'Could not read installed quire-11ty version',
      remediation: `Check that ${QUIRE_11TY_PACKAGE} is properly installed:
    • Run "npm install" to reinstall dependencies
    • If the issue persists, delete node_modules and reinstall`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#install-dependencies`,
    }
  }

  // Fetch latest version from npm registry
  const updateChannel = config.get('updateChannel') || 'rc'
  let latestVersion
  try {
    latestVersion = await npm.view(QUIRE_11TY_PACKAGE, `dist-tags.${updateChannel}`)
    debug('Latest quire-11ty version (%s channel): %s', updateChannel, latestVersion)
  } catch (error) {
    debug('Failed to fetch latest quire-11ty version: %s', error.message)
    return {
      ok: true,
      message: `v${installedVersion} (could not check for updates)`,
    }
  }

  // Compare versions
  if (semver.lt(installedVersion, latestVersion)) {
    return {
      ok: false,
      level: 'warn',
      message: `v${installedVersion} installed, v${latestVersion} available`,
      remediation: `Update quire-11ty to the latest version:
    • Run "quire use ${latestVersion}" to update
    • Then run "npm install" to install the new version`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#update-quire`,
    }
  }

  return {
    ok: true,
    message: `v${installedVersion} (up to date)`,
  }
}

export default checkOutdatedQuire11ty
