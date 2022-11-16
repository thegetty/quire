import { execa } from 'execa'
import path from 'node:path'
import paths, { eleventyRoot, projectRoot } from './paths.js'

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

  /**
   * Use the version of Eleventy installed to `lib/quire/versions`
   */
  const eleventy =
    path.join(eleventyRoot, 'node_modules', '@11ty', 'eleventy', 'cmd.js')

  const command = [
    eleventy,
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

    await execa('node', eleventyCommand, {
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

    await execa('node', eleventyCommand, {
      all: true,
      cwd: projectRoot,
      env: execaEnv,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  }
}
