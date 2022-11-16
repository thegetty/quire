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
const factory = (options = {}) => {
  const { config, input, output } = paths

  console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

  console.debug('[CLI:11ty] %o', paths)

  const command = [
    `@11ty/eleventy`,
    `--config=${config}`,
    `--input=${input}`,
    `--output=${output}`,
    `--incremental`,
  ]

  if (options.quiet) command.push('--quiet')
  if (options.verbose) command.push('--verbose')

  return command
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

    await execa('npx', eleventyCommand, {
      all: true,
      cwd: projectRoot,
      env: execaEnv,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  },

  serve: async (options = {}) => {
    console.info(`[CLI:11ty] running eleventy serve`)

    const eleventyCommand = factory(options)

    eleventyCommand.push('--serve')

    /**
     * Set execa environment variables
     * @see https://github.com/sindresorhus/execa#env
     */
    const execaEnv = {}

    if (options.debug) execaEnv.DEBUG = 'Eleventy*'

    if (options.port) eleventyCommand.push(`--port=${options.port}`)

    await execa('npx', eleventyCommand, {
      all: true,
      cwd: projectRoot,
      env: execaEnv,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  }
}
