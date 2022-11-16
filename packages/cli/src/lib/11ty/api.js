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

  console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

  console.debug('[CLI:11ty] %o', paths)

  /**
   * Dynamically import the correct version of Eleventy from `lib/quire/versions`
   */
  const { default: Eleventy } = await import(path.join(eleventyRoot, 'node_modules', '@11ty', 'eleventy', 'src', 'Eleventy.js'))

  /**
   * Set Eleventy passthrough copy options
   * @see https://www.11ty.dev/docs/copy/#advanced-options
   * @see https://github.com/timkendrick/recursive-copy
   */
  const copyOptions = {
    debug: options.debug || false,
    expand: true,
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
  return new Eleventy(input, output, {
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
          const filePath = path.resolve(entry) //path.join(projectRoot, file)
          // console.debug('[11ty:API] passthrough copy %s', filePath)
          return addPassthroughCopy(filePath, copyOptions)
        } else {
          // console.debug('[11ty:API] passthrough copy %o', entry)
          entry = Object.fromEntries(
            Object.entries(entry).map(([ src, dest ]) => {
              return [ path.join(eleventyRoot, src), path.resolve(dest) ]
            })
          )
          // console.debug('[11ty:API] passthrough copy %o', entry)
          return addPassthroughCopy(entry, copyOptions)
        }
      }
      return eleventyConfig
    },
    configPath: options.config || config,
    quietMode: options.quiet || false,
  })
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
    console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

    if (options.debug) process.env.DEBUG = 'Eleventy*'

    const eleventy = await factory(options)
    await eleventy.executeBuild()
  },
  serve: async (options = {}) => {
    console.info('[CLI:11ty] running development server')

    if (options.debug) process.env.DEBUG = 'Eleventy*'

    const eleventy = await factory(options)
    await eleventy.serve()
  }
}
