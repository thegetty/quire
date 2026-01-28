/**
 * Quire11ty façade for Eleventy integration
 *
 * Provides a unified interface for Eleventy operations with path resolution.
 * Follows the singleton pattern like lib/npm and lib/git for consistency
 * and easy mocking in tests.
 *
 * @example Production usage
 * import eleventy from '#lib/11ty/index.js'
 * await eleventy.build({ debug: true })
 * const outputDir = eleventy.paths.getOutputDir()
 *
 * @example Path-only usage
 * import { paths } from '#lib/11ty/index.js'
 * const projectRoot = paths.getProjectRoot()
 *
 * @example Test mocking
 * const mockEleventy = {
 *   build: sandbox.stub().resolves(),
 *   serve: sandbox.stub().resolves(),
 *   paths: {
 *     getProjectRoot: () => '/project',
 *     getOutputDir: () => '_site'
 *   }
 * }
 * const MyCommand = await esmock('./mycommand.js', {
 *   '#lib/11ty/index.js': { default: mockEleventy }
 * })
 *
 * @see https://www.11ty.dev/docs/programmatic/
 * @module lib/11ty
 */
import { dynamicImport } from '#helpers/os-utils.js'
import path from 'node:path'
import paths from '#lib/project/index.js'
import reporter from '#lib/reporter/index.js'
import createDebug from '#debug'

const debug = createDebug('lib:11ty:api')

/**
 * Configure environment variables required for Eleventy.
 *
 * These must be set before the Eleventy instance is created and the
 * `.eleventy.js` configuration file is parsed.
 *
 * @see https://github.com/11ty/eleventy/issues/2655
 *
 * @param {Object} options
 * @param {'production'|'development'} options.mode - Build mode
 * @param {boolean} options.debug - Enable Eleventy debug output
 */
const configureEleventyEnv = ({ mode = 'production', debug = false } = {}) => {
  // Path configuration for decoupling quire-11ty from project input directory
  process.env.ELEVENTY_DATA = paths.getDataDir()
  process.env.ELEVENTY_INCLUDES = paths.getIncludesDir()
  process.env.ELEVENTY_LAYOUTS = paths.getLayoutsDir()

  // Build mode
  process.env.ELEVENTY_ENV = mode

  // Debug output
  if (debug) {
    process.env.DEBUG = 'Eleventy*'
  }
}

/**
 * Create an instance of Eleventy configured for Quire projects
 *
 * @param {Object} options - Eleventy configuration options
 * @param {boolean} [options.debug=false] - Enable debug output
 * @param {boolean} [options.quiet=false] - Suppress output
 * @param {string} [options.config] - Custom config path override
 * @param {'build'|'serve'|'watch'} [options.runMode='build'] - Eleventy run mode
 * @returns {Promise<Eleventy>} Configured Eleventy instance
 */
const createEleventyInstance = async (options = {}) => {
  const config = paths.getConfigPath()
  const eleventyRoot = paths.getEleventyRoot()
  const input = paths.getInputDir()
  const output = paths.getOutputDir()
  const projectRoot = paths.getProjectRoot()

  debug('projectRoot: %s', projectRoot)
  debug('paths: %O', paths.toObject())

  // Dynamically import the correct version of Eleventy
  const modulePath = path.join(eleventyRoot, 'node_modules', '@11ty', 'eleventy', 'src', 'Eleventy.js')
  const { default: Eleventy } = await dynamicImport(modulePath)

  // Create Eleventy instance
  // @see https://github.com/11ty/eleventy/blob/src/Eleventy.js
  const eleventy = new Eleventy(input, output, {
    config: (eleventyConfig) => {
      // Event callback when a build completes
      // @see https://www.11ty.dev/docs/events/#eleventy.after
      eleventyConfig.on('eleventy.after', async () => {
        debug('build complete')
      })

      return eleventyConfig
    },
    configPath: options.config || config,
    quietMode: options.quiet || false,
    runMode: options.runMode || 'build',
  })

  return eleventy
}

/**
 * Quire11ty façade class
 *
 * Provides abstracted Eleventy operations with unified logging,
 * error handling, and path resolution. Stores active Eleventy
 * instance for cleanup registration with ProcessManager.
 */
class Quire11ty {
  /**
   * Create Quire11ty instance
   * @param {Object} pathsInstance - Paths instance for path resolution
   */
  constructor(pathsInstance) {
    this.paths = pathsInstance
    /**
     * Active Eleventy instance (for API mode)
     * @type {Eleventy|null}
     */
    this.activeInstance = null
  }

  /**
   * Check if an Eleventy process is currently active
   * @returns {boolean}
   */
  isActive() {
    return this.activeInstance !== null
  }

  /**
   * Gracefully close any active Eleventy process
   *
   * Calls eleventy.close() to stop the dev server and file watchers.
   * This method is registered with ProcessManager for signal handling.
   *
   * @returns {Promise<void>}
   */
  async close() {
    if (this.activeInstance) {
      debug('shutting down Eleventy')
      try {
        await this.activeInstance.close()
      } catch (error) {
        // Ignore errors during shutdown (may already be closing)
        debug('close error (may be expected): %s', error.message)
      }
      this.activeInstance = null
    }
  }

  /**
   * Run Eleventy production build
   *
   * @param {Object} options - Build options
   * @param {boolean} [options.debug=false] - Enable debug output
   * @param {boolean} [options.dryRun=false] - Perform dry run without writing files
   * @param {boolean} [options.quiet=false] - Suppress output
   * @returns {Promise<void>}
   */
  async build(options = {}) {
    const projectRoot = this.paths.getProjectRoot()
    process.chdir(projectRoot)

    configureEleventyEnv({ mode: 'production', debug: options.debug })

    reporter.start('Building site...', { showElapsed: true })

    const eleventy = await createEleventyInstance(options)

    eleventy.setDryRun(options.dryRun)

    try {
      await eleventy.write()
      reporter.succeed('Build complete')
    } catch (error) {
      reporter.fail('Build failed')
      throw error
    }
  }

  /**
   * Run Eleventy development server
   *
   * @param {Object} options - Serve options
   * @param {boolean} [options.debug=false] - Enable debug output
   * @param {number} [options.port] - Server port
   * @param {boolean} [options.quiet=false] - Suppress output
   * @returns {Promise<void>}
   */
  async serve(options = {}) {
    const projectRoot = this.paths.getProjectRoot()
    process.chdir(projectRoot)

    configureEleventyEnv({ mode: 'development', debug: options.debug })

    reporter.start('Starting development server...')

    const eleventy =
      await createEleventyInstance({ ...options, runMode: 'serve' })

    // Store reference for lifecycle management (graceful shutdown)
    this.activeInstance = eleventy

    // Initialize Eleventy before serving (required for eleventyServe)
    await eleventy.init()

    await eleventy.serve(options.port)
  }
}

export { Quire11ty, createEleventyInstance, configureEleventyEnv }
