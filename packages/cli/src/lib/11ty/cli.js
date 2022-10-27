import execa from 'execa'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import paths from './paths.js'

/**
 * A wrapper module for the Eleventy CLI
 * @see https://www.11ty.dev/docs/usage/#command-line-usage
 */
export default {
  build: async (options = {}) => {
    const projectRoot = path.resolve('../../packages/11ty')

    console.info('[CLI:11ty] running eleventy build')
    console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

    const { config, input, output } = paths

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

    await execa('npx', eleventyOptions, { cwd: projectRoot }).stdout.pipe(process.stdout)
  }
}
