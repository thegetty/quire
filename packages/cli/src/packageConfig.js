import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPackageUpSync } from 'read-package-up'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Nota bene: current working directory will be that from which cli commands
 * are being, readPackageUpSync is passed the directory of this module as the
 * starting path to search for the quire-cli package config file.
 */
const { packageJson } = readPackageUpSync({ cwd: __dirname, normalize: true })

export default packageJson
