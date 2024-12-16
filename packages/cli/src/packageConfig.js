import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPackageUpSync } from 'read-package-up'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Nota bene:
 * working directory will be the path from which quire-cli commands are run;
 * readPackageUpSync must be called with the change working directory option
 * set to the path of this module to find the quire-cli package config file.
 */
const { packageJson } = readPackageUpSync({ cwd: __dirname, normalize: true })

export default packageJson
