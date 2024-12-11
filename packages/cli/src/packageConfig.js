import { readPackageUpSync } from 'read-package-up'

const { packageJson } = readPackageUpSync()

export default packageJson
