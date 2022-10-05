import path from 'node:path'
import Eleventy from '@11ty/eleventy'

/**
 * A wrapper module for Eleventy
 * @see https://www.11ty.dev/docs/programmatic/
 */
export default {
  build: async () => {
    const paths = {
      config: path.join('../../../../packages/11ty/.eleventy.js'),
      input: path.join('../../../../packages/11ty/content/'),
      output: '_site'
    }

    const eleventy = new Eleventy(paths.input, paths.output, {
      config: (eleventyConfig) => {
        // custom configuration
      },
      configPath: paths.config,
      quiteMode: false,
    })

    console.log(`running eleventy...`)

    await eleventy.write()
  }
}
