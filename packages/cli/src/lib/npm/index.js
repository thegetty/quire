/**
 * NPM façade class providing abstracted npm operations
 *
 * Provides a consistent interface for npm commands with unified
 * logging, error handling, and testability. Follows the singleton
 * pattern like lib/logger.js for easy mocking in tests.
 *
 * @example in production code
 * import npm from '#lib/npm/index.js'
 * await npm.install(projectPath, { saveDev: true })
 *
 * @example in test code
 * const mockNpm = {
 *   install: sandbox.stub().resolves(),
 *   version: sandbox.stub().resolves('10.2.4')
 * }
 * const MyCommand = await esmock('./mycommand.js', {
 *   '#lib/npm/index.js': { default: mockNpm }
 * })
 *
 * @see https://docs.npmjs.com/cli/ - npm CLI documentation
 * @module npm
 */
import { execa, execaCommand } from 'execa'
import fetch from 'node-fetch'
import semver from 'semver'
import which from '#helpers/which.js'

const LOG_PREFIX = '[CLI:lib/npm]'

/**
 * NPM façade class
 */
class Npm {
  /**
   * Clean npm cache
   * @see https://docs.npmjs.com/cli/commands/npm-cache
   * @param {string} [cwd] - Working directory (optional)
   * @returns {Promise<void>}
   */
  async cacheClean(cwd) {
    console.debug(`${LOG_PREFIX} cleaning npm cache`)
    const options = cwd ? { cwd } : {}
    await execaCommand('npm cache clean --force', options)
  }

  /**
   * Fetch package metadata directly from npm registry
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md
   * @param {string} packageName - Package name
   * @returns {Promise<Object>} Package metadata from registry
   */
  async fetchFromRegistry(packageName) {
    console.debug(`${LOG_PREFIX} fetching registry metadata for ${packageName}`)
    const response = await fetch(`https://registry.npmjs.org/${packageName}`)
    if (!response.ok) {
      throw new Error(
        `${LOG_PREFIX} Failed to fetch package metadata for ${packageName}: ${response.statusText}`
      )
    }
    return await response.json()
  }

  /**
   * Get latest version compatible with a semver range
   * @see https://docs.npmjs.com/about-semantic-versioning
   * @see https://github.com/npm/node-semver#ranges
   * @param {string} packageName - Package name
   * @param {string} range - Semver range (e.g., "^1.0.0")
   * @returns {Promise<string|null>} Latest compatible version or null if none found
   */
  async getCompatibleVersion(packageName, range) {
    console.debug(`${LOG_PREFIX} finding version of ${packageName} compatible with ${range}`)
    const metadata = await this.fetchFromRegistry(packageName)
    const versions = Object.keys(metadata.versions)
    return semver.maxSatisfying(versions, range)
  }

  /**
   * Initialize a new package.json
   * @see https://docs.npmjs.com/cli/commands/npm-init
   * @param {string} cwd - Working directory
   * @param {Object} options - Configuration options
   * @param {boolean} [options.yes=true] - Auto-accept defaults
   * @returns {Promise<void>}
   */
  async init(cwd, options = {}) {
    const { yes = true } = options
    const flags = yes ? '--yes' : ''

    console.debug(`${LOG_PREFIX} initializing package.json in ${cwd}`)
    await execaCommand(`npm init ${flags}`.trim(), { cwd })
  }

  /**
   * Install dependencies
   * @see https://docs.npmjs.com/cli/commands/npm-install
   * @param {string} cwd - Working directory
   * @param {Object} options - Configuration options
   * @param {boolean} [options.saveDev=false] - Install as devDependencies
   * @param {boolean} [options.preferOffline=false] - Prefer cached packages
   * @returns {Promise<void>}
   */
  async install(cwd, options = {}) {
    const { preferOffline = false, saveDev = false } = options
    const flags = [
      preferOffline && '--prefer-offline',
      saveDev && '--save-dev'
    ].filter(Boolean).join(' ')

    console.debug(`${LOG_PREFIX} installing dependencies in ${cwd}`)
    await execaCommand(`npm install ${flags}`.trim(), { cwd })
  }

  /**
   * Check if npm is available in PATH
   * @returns {boolean} True if npm is available
   */
  isAvailable() {
    return !!which('npm')
  }

  /**
   * Create a tarball (.tgz file) of the npm package
   * @see https://docs.npmjs.com/cli/commands/npm-pack
   * @param {string} packageSpec - Package name with version (e.g., "@thegetty/quire-11ty@1.0.0")
   * @param {string} destination - Destination directory for the tarball
   * @param {Object} options - Configuration options
   * @param {boolean} [options.quiet=true] - Suppress output
   * @param {boolean} [options.debug=false] - Enable debug output
   * @returns {Promise<void>}
   */
  async pack(packageSpec, destination, options = {}) {
    const { debug = false, quiet = true } = options
    const verbosity = debug ? '--debug' : (quiet ? '--quiet' : '')

    console.debug(`${LOG_PREFIX} packing ${packageSpec} to ${destination}`)
    await execaCommand(
      `npm pack ${verbosity} --pack-destination ${destination} ${packageSpec}`.trim()
    )
  }

  /**
   * Show package info (similar to view)
   * @see https://docs.npmjs.com/cli/commands/npm-view
   * @param {string} packageName - Package name
   * @param {string} [field='versions'] - Field to retrieve
   * @returns {Promise<string>} The requested field value
   */
  async show(packageName, field = 'versions') {
    console.debug(`${LOG_PREFIX} showing ${field} for ${packageName}`)
    const result = await execa('npm', ['show', packageName, field])
    return result
  }

  /**
   * Get npm version
   * @see https://docs.npmjs.com/cli/commands/npm-version
   * @returns {Promise<string>} npm version string
   */
  async version() {
    const { stdout } = await execaCommand('npm --version')
    return stdout
  }

  /**
   * View package info from registry
   * @see https://docs.npmjs.com/cli/commands/npm-view
   * @param {string} packageName - Package name
   * @param {string} [field='version'] - Field to retrieve
   * @returns {Promise<string>} The requested field value
   */
  async view(packageName, field = 'version') {
    console.debug(`${LOG_PREFIX} viewing ${field} for ${packageName}`)
    const { stdout } = await execa('npm', ['view', packageName, field])
    return stdout
  }
}

// Export singleton instance
export default new Npm()
