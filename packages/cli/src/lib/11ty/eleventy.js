import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Eleventy from '@11ty/eleventy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const factory = (options) => {
  /**
   * Get paths for configuring Eleventy
   * Nota bene: `basePath` is relative to `main.js`, the CLI entry point.
   */
  const basePath = '../../packages/11ty'

  const paths = {
    config: path.resolve(basePath, '.eleventy.js'),
    input: path.resolve(basePath, 'content'),
    output: path.resolve(basePath, '_site')
  }

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
 * A wrapper module for Eleventy
 * @see https://www.11ty.dev/docs/programmatic/
 * @todo read paths from the project configuration
 */
export default {
  build: async (options = {}) => {
    const eleventy = factory(options)

    console.log('[CLI] running eleventy build')

    await eleventy.executeBuild()
  },
  serve: async (options = {}) => {
    const eleventy = factory(options)

    console.log('[CLI] running development server')

    await eleventy.serve()
  }
}
