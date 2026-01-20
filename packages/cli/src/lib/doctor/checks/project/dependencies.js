/**
 * Dependencies check
 *
 * @module lib/doctor/checks/project/dependencies
 */
import fs from 'node:fs'
import path from 'node:path'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'

const debug = createDebug('lib:doctor:dependencies')

/**
 * Check if dependencies are installed
 * @returns {import('../../index.js').CheckResult}
 */
export function checkDependencies() {
  const hasPackageJson = fs.existsSync('package.json')
  const hasNodeModules = fs.existsSync('node_modules')

  debug('package.json exists: %s, node_modules exists: %s', hasPackageJson, hasNodeModules)

  if (!hasPackageJson) {
    return {
      ok: true,
      level: 'na',
      message: 'No package.json (not in project directory)',
    }
  }

  if (!hasNodeModules) {
    return {
      ok: false,
      message: 'node_modules not found',
      remediation: `Install project dependencies by running:
    • npm install

    If you continue to have issues:
    • Delete node_modules folder and package-lock.json, then run npm install again
    • Ensure you have write permissions in the project directory`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#install-dependencies`,
    }
  }

  const nodeModulesPath = path.resolve('node_modules')
  return {
    ok: true,
    message: 'installed',
    details: nodeModulesPath,
  }
}

export default checkDependencies
