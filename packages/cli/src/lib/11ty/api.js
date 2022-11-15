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
      // custom configuration
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
