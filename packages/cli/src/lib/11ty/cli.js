import { execa } from 'execa'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import paths, { projectRoot } from './paths.js'

/**
 * A factory function to configure an Eleventy CLI command
 *
 * @param  {Object}  options  Eleventy configuration options
 * @return  {Array} Eleventy CLI options
 */
const factory = () => {
  const { config, input, output } = paths

  console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

  console.debug('[CLI:11ty] %o', paths)

  return [
    `@11ty/eleventy`,
    `--config=${config}`,
    `--input=${input}`,
    `--output=${output}`,
    `--incremental`,
  ]
}

/**
 * A wrapper module for using the Eleventy CLI programmatically
 * @see https://www.11ty.dev/docs/usage/#command-line-usage
 */
export default {
  build: async (options = {}) => {
    console.info('[CLI:11ty] running eleventy build')

    const eleventyCommand = factory()

    /**
     * Set execa environment variables
     * @see https://github.com/sindresorhus/execa#env
     */
    const execaEnv = {}

    if (options.debug) execaEnv.DEBUG = 'Eleventy*'
    if (options.dryRun) eleventyCommand.push('--dryrun')
    if (options.quiet) eleventyCommand.push('--quiet')

    await execa('npx', eleventyCommand, {
      all: true,
      cwd: projectRoot,
      env: execaEnv,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  },

  serve: async (options = {}) => {
    console.info(`[CLI:11ty] running eleventy serve`)

    const eleventyOptions = factory()

    eleventyOptions.push('--serve')

    /**
     * Set execa environment variables
     * @see https://github.com/sindresorhus/execa#env
     */
    const execaEnv = {}

    if (options.debug) execaEnv.DEBUG = 'Eleventy*'
    if (options.port) eleventyOptions.push(`--port=${options.port}`)
    if (options.quiet) eleventyOptions.push('--quiet')
    if (options.verbose) eleventyOptions.push('--verbose')

    await execa('npx', eleventyOptions, {
      all: true,
      cwd: projectRoot,
      env: execaEnv,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  }
}
