import { dynamicImport } from '#helpers/os-utils.js'
import path from 'node:path'
import paths from './paths.js'

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
 * A factory function to configure an instance of Eleventy
 * @see https://www.11ty.dev/docs/config/#configuration-options
 *
 * @param  {Object}  options  Eleventy configuration options
 * @return  {Eleventy}  A configured instance of Eleventy
 */
const factory = async (options = {}) => {
  const config = paths.getConfigPath()
  const eleventyRoot = paths.getEleventyRoot()
  const input = paths.getInputDir()
  const output = paths.getOutputDir()
  const projectRoot = paths.getProjectRoot()

  if (options.debug) {
    console.debug('[CLI:11ty] projectRoot %s\n%o', projectRoot, paths.toObject())
  }

  /**
   * Dynamically import the correct version of Eleventy
   */
  const modulePath = path.join(eleventyRoot, 'node_modules', '@11ty', 'eleventy', 'src', 'Eleventy.js')
  const { default: Eleventy } = await dynamicImport(modulePath)

  /**
   * Set Eleventy passthrough copy options
   * @see https://www.11ty.dev/docs/copy/#advanced-options
   * @see https://github.com/timkendrick/recursive-copy
   */
  const copyOptions = {
    debug: options.debug || false
  }

  /**
   * Get an instance of the runtime of eleventy.
   * @see https://github.com/11ty/eleventy/blob/src/Eleventy.js
   *
   * @param {String} input  Path from which to read content templates
   * @param {String} output  Path where rendered files will be written
   * @param {Object} options  Options are merged with the Eleventy UserConfig
   * @param {Object} config  An eleventy configurtion object
   *
   * @returns {module:11ty/eleventy/Eleventy~Eleventy}
   */
  const eleventy = new Eleventy(input, output, {
    config: (eleventyConfig) => {
      /**
       * Override addPassthroughCopy to use _absolute_ system paths.
       * @see https://www.11ty.dev/docs/copy/#passthrough-file-copy
       * Nota bene: Eleventy addPassthroughCopy assumes paths are _relative_
       * to the `config` file however the quire-cli separates 11ty from the
       * project directory (`input`) and needs to use absolute system paths.
       */
      const addPassthroughCopy = eleventyConfig.addPassthroughCopy.bind(eleventyConfig)
      eleventyConfig.addPassthroughCopy = (entry) => {
        if (typeof entry === 'string') {
          const filePath = path.resolve(entry)
          return addPassthroughCopy(filePath, copyOptions)
        } else {
          entry = Object.fromEntries(
            Object.entries(entry).map(([ src, dest ]) => {
              return [ path.join(eleventyRoot, src), path.resolve(dest) ]
            })
          )
          return addPassthroughCopy(entry, copyOptions)
        }
      }

      /**
       * Event callback when a build completes
       * @see https://www.11ty.dev/docs/events/#eleventy.after
       */
      eleventyConfig.on('eleventy.after', async () => {
        console.debug('[11ty:API] build complete')
      })

      return eleventyConfig
    },
    configPath: options.config || config,
    quietMode: options.quiet || false,
  })

  return eleventy
}

/**
 * A wrapper module for using the Eleventy programmatic API
 * @see https://www.11ty.dev/docs/programmatic/
 * @todo read paths from the Quire project configuration
 */
export default {
  build: async (options = {}) => {
    const projectRoot = paths.getProjectRoot()
    process.cwd(projectRoot)

    console.info('[CLI:11ty] running eleventy build')

    configureEleventyEnv({ mode: 'production', debug: options.debug })

    const eleventy = await factory(options)

    eleventy.setDryRun(options.dryRun)

    await eleventy.write()
  },
  serve: async (options = {}) => {
    const projectRoot = paths.getProjectRoot()
    process.cwd(projectRoot)

    console.info('[CLI:11ty] running development server')

    configureEleventyEnv({ mode: 'development', debug: options.debug })

    const eleventy = await factory(options)

    await eleventy.serve(options.port)
  }
}
