import Eleventy from '@11ty/eleventy'
import path from 'node:path'
import paths from './paths.js'

/**
 * A factory function to configure an instance of Eleventy
 * @see https://www.11ty.dev/docs/config/#configuration-options
 *
 * @param  {Object}  options  Eleventy configuration options
 * @return  {Eleventy}  A configured instance of Eleventy
 */
const factory = (options) => {
  const { config, input, output } = paths

  return new Eleventy(input, output, {
    config: (eleventyConfig) => {
      // custom configuration
    },
    configPath: options.config || config,
    quiteMode: options.quite || false,
  })
}

/**
 * A wrapper module for using the Eleventy programmatic API
 * @see https://www.11ty.dev/docs/programmatic/
 * @todo read paths from the Quire project configuration
 */
export default {
  build: async (options = {}) => {
    const projectRoot = path.resolve('../../packages/11ty')
    process.cwd(projectRoot)

    console.info('[CLI:11ty] running eleventy build')
    console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

    const eleventy = factory(options)
    await eleventy.executeBuild()
  },
  serve: async (options = {}) => {
    console.info('[CLI:11ty] running development server')
    const eleventy = factory(options)
    await eleventy.serve()
  }
}
