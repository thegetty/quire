import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPackageUpSync } from 'read-package-up'
import which from '#helpers/which.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Nota bene: current working directory will be that from which cli commands
 * are being, readPackageUpSync is passed the directory of this module as the
 * starting path to search for the quire-cli package config file.
 */
const { packageJson } = readPackageUpSync({ cwd: __dirname, normalize: true })

/**
 * Resolve the full filesystem path to the quire CLI executable
 *
 * Uses the `which` helper to find the first `quire` executable in PATH.
 * Returns null if the executable is not found.
 *
 * @returns {string|null} Absolute path to the quire executable, or null
 */
export function binPath() {
  try {
    return which('quire')
  } catch {
    return null
  }
}

export default packageJson
