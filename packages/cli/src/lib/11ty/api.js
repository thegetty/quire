import path from 'node:path'
import paths, { eleventyRoot, projectRoot } from './paths.js'

/**
 * A factory function to configure an instance of Eleventy
 * @see https://www.11ty.dev/docs/config/#configuration-options
 *
 * @param  {Object}  options  Eleventy configuration options
 * @return  {Eleventy}  A configured instance of Eleventy
 */
const factory = async (options) => {
  const { config, input, output } = paths

  console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

  console.debug('[CLI:11ty] %o', paths)

  /**
   * Dynamically import the correct version of Eleventy from `lib/quire/versions`
   */
  const { default: Eleventy } = await import(path.join(eleventyRoot, 'node_modules', '@11ty', 'eleventy', 'src', 'Eleventy.js'))

  return new Eleventy(input, output, {
    config: (eleventyConfig) => {
      /**
       * Override addPassthroughCopy to use absolute system paths.
       * Nota bene: Eleventy addPassthroughCopy assumes paths are relative to
       * the `config` file path however the quire-cli separates 11ty from the
       * project directory (`input`) and needs to use absolute system paths.
       */
      const addPassthroughCopy = eleventyConfig.addPassthroughCopy.bind(eleventyConfig)
      eleventyConfig.addPassthroughCopy = (file) => {
        if (typeof file === 'string') {
          const filePath = path.join(projectRoot, file)
          console.debug('[11ty:API] passthrough copy %s', filePath)
          return addPassthroughCopy(filePath)
        } else {
          console.debug('[11ty:API] passthrough copy %o', file)
          return addPassthroughCopy(file)
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
