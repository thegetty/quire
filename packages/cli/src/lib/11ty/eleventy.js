import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Eleventy from '@11ty/eleventy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A wrapper module for Eleventy
 * @see https://www.11ty.dev/docs/programmatic/
 * @todo read paths from the project configuration
 */
export default {
  build: async (options = {}) => {
    /**
     * Nota bene: `basePath` is relative to `main.js`, the CLI entry point.
     */
    const basePath = '../../packages/11ty'

    const paths = {
      config: path.resolve(basePath, '.eleventy.js'),
      input: path.resolve(basePath, 'content'),
      output: path.resolve(basePath, '_site')
    }

    // if (options.debug) {
      // console.log(`basePath: ${basePath}`)
      console.log(`paths: `, paths)
    // }

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
