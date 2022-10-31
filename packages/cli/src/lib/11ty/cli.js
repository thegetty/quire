import execa from 'execa'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import paths from './paths.js'

/**
 * A wrapper module for the Eleventy CLI
 * @see https://www.11ty.dev/docs/usage/#command-line-usage
 */
const { config, input, output } = paths
const projectRoot = path.resolve('../../packages/11ty')

export default {
  build: async (options = {}) => {
    console.info('[CLI:11ty] running eleventy build')
    console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

    console.debug('[CLI:11ty] %o', paths)

    const eleventyOptions = [
      `@11ty/eleventy`,
      `--config=${config}`,
      `--input=${input}`,
      `--output=${output}`,
      '--incremental',
    ]

    if (options.dryRun) eleventyOptions.push('--dryrun')
    if (options.quiet) eleventyOptions.push('--quiet')

    await execa('npx', eleventyOptions, { cwd: projectRoot, stdout: 'pipe' })
  },

  serve: async (options = {}) => {
    console.info('[CLI:11ty] running eleventy serve')

    const eleventyOptions = [
      `@11ty/eleventy`,
      `--config=${config}`,
      `--input=${input}`,
      `--output=${output}`,
      `--serve`,
      '--incremental'
    ]

    await execa('npx', eleventyOptions, { cwd: projectRoot, stdout: 'pipe' })
  }
}
