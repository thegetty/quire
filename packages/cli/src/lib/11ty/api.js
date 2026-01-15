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
import paths from './paths.js'

const LOG_PREFIX = '[CLI:lib/11ty]'

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
 * @returns {Promise<Eleventy>} Configured Eleventy instance
 */
const createEleventyInstance = async (options = {}) => {
  const config = paths.getConfigPath()
  const eleventyRoot = paths.getEleventyRoot()
  const input = paths.getInputDir()
  const output = paths.getOutputDir()
  const projectRoot = paths.getProjectRoot()

  if (options.debug) {
    console.debug(`${LOG_PREFIX} projectRoot %s\n%o`, projectRoot, paths.toObject())
  }

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
        console.debug(`${LOG_PREFIX} build complete`)
      })

      return eleventyConfig
    },
    configPath: options.config || config,
    quietMode: options.quiet || false,
  })

  return eleventy
}

/**
 * Quire11ty façade class
 *
 * Provides abstracted Eleventy operations with unified logging,
 * error handling, and path resolution.
 */
class Quire11ty {
  /**
   * Create Quire11ty instance
   * @param {Object} pathsInstance - Paths instance for path resolution
   */
  constructor(pathsInstance) {
    this.paths = pathsInstance
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

    console.info(`${LOG_PREFIX} running eleventy build`)

    configureEleventyEnv({ mode: 'production', debug: options.debug })

    const eleventy = await createEleventyInstance(options)

    eleventy.setDryRun(options.dryRun)

    await eleventy.write()
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

    console.info(`${LOG_PREFIX} running development server`)

    configureEleventyEnv({ mode: 'development', debug: options.debug })

    const eleventy = await createEleventyInstance(options)

    await eleventy.serve(options.port)
  }
}

export { Quire11ty, createEleventyInstance, configureEleventyEnv }
