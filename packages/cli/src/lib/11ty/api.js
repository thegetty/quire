import { dynamicImport } from '#helpers/os-utils.js'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import paths, { eleventyRoot, projectRoot } from './paths.js'

/**
 * A factory function to configure an instance of Eleventy
 * @see https://www.11ty.dev/docs/config/#configuration-options
 *
 * @param  {Object}  options  Eleventy configuration options
 * @return  {Eleventy}  A configured instance of Eleventy
 */
const factory = async (options = {}) => {
  const { config, input, output } = paths

  if (options.debug) {
    console.debug('[CLI:11ty] projectRoot %s\n%o', projectRoot, paths)
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
   * Set environment variables for paths relative to eleventy `input` dir,
   * to allow `quire-11ty` to be decouple from the project input directory.
   * Nota bene: environment variables read into the eleventy configuration
   * file _must_ be set before the eleventy configuration file is parsed.
   * @see https://github.com/11ty/eleventy/issues/2655
   */
  process.env.ELEVENTY_DATA = paths.data
  process.env.ELEVENTY_INCLUDES = paths.includes
  process.env.ELEVENTY_LAYOUTS = paths.layouts
  process.env.QUIRE_DEBUG_LOG = options.debug

  /**
   * Get an instance of the runtime of eleventy.
   * @see https://github.com/11ty/eleventy/blob/src/Eleventy.js
   *
   * @param {String} input  Path from which to read content templates
   * @param {String} output  Path where rendered files will be written
   * @param {Object} options  Options are merged with the Eleventy UserConfig
   * @property {string} config  Config callback run after initialization 
   *
   * @returns {module:11ty/eleventy/Eleventy~Eleventy}
   */
  const eleventy = new Eleventy(input, output, {
    config: (eleventyConfig) => {
      /**
       * Event callback when a build completes
       * @see https://www.11ty.dev/docs/events/#eleventy.after
       */
      eleventyConfig.on('eleventy.after', async () => {
        console.debug('[11ty:API] build complete')
      })
    },
    configPath: options.config || config,
    quietMode: options.quiet || false,
    runMode: process.env.ELEVENTY_ENV === 'production' ? 'build' : 'serve'
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
    process.cwd(projectRoot)

    console.info('[CLI:11ty] running eleventy build')

    process.env.ELEVENTY_ENV = 'production'
    if (options.debug) process.env.DEBUG = 'Eleventy*'

    const eleventy = await factory(options)

    eleventy.setDryRun(options.dryrun)

    await eleventy.write()
  },
  serve: async (options = {}) => {
    process.cwd(projectRoot)

    console.info('[CLI:11ty] running development server')

    process.env.ELEVENTY_ENV = 'development'
    if (options.debug) process.env.DEBUG = 'Eleventy*'

    const eleventy = await factory(options)
    await eleventy.init()
    await eleventy.watch()

    await eleventy.serve(options.port)

    process.on("SIGINT", async () => {
      await eleventy.stopWatch()
      process.exit(0)
    })
  }
}
