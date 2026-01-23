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
import { execa } from 'execa'
import fetch from 'node-fetch'
import semver from 'semver'
import which from '#helpers/which.js'
import createDebug from '#debug'

const debug = createDebug('lib:npm')

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
    debug('cleaning npm cache')
    const options = cwd ? { cwd } : {}
    await execa('npm', ['cache', 'clean', '--force'], options)
  }

  /**
   * Fetch package metadata directly from npm registry
   * @see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md
   * @param {string} packageName - Package name
   * @returns {Promise<Object>} Package metadata from registry
   */
  async fetchFromRegistry(packageName) {
    debug('fetching registry metadata for %s', packageName)
    const response = await fetch(`https://registry.npmjs.org/${packageName}`)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch package metadata for ${packageName}: ${response.statusText}`
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
    debug('finding version of %s compatible with %s', packageName, range)
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
    const args = ['init']
    if (yes) args.push('--yes')

    debug('initializing package.json in %s', cwd)
    await execa('npm', args, { cwd })
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
    const args = ['install']
    if (preferOffline) args.push('--prefer-offline')
    if (saveDev) args.push('--save-dev')

    debug('installing dependencies in %s', cwd)
    await execa('npm', args, { cwd })
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
    const { debug: debugMode = false, quiet = true } = options
    const args = ['pack']
    if (debugMode) args.push('--debug')
    else if (quiet) args.push('--quiet')
    args.push('--pack-destination', destination, packageSpec)

    debug('packing %s to %s', packageSpec, destination)
    await execa('npm', args)
  }

  /**
   * Show package info (similar to view)
   * @see https://docs.npmjs.com/cli/commands/npm-view
   * @param {string} packageName - Package name
   * @param {string} [field='versions'] - Field to retrieve
   * @returns {Promise<string>} The requested field value
   */
  async show(packageName, field = 'versions') {
    debug('showing %s for %s', field, packageName)
    const result = await execa('npm', ['show', packageName, field])
    return result
  }

  /**
   * Get npm version
   * @see https://docs.npmjs.com/cli/commands/npm-version
   * @returns {Promise<string>} npm version string
   */
  async version() {
    const { stdout } = await execa('npm', ['--version'])
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
    debug('viewing %s for %s', field, packageName)
    const { stdout } = await execa('npm', ['view', packageName, field])
    return stdout
  }
}

// Export singleton instance
export default new Npm()
