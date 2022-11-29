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

  /**
   * Set execa environment variables
   * @see https://github.com/sindresorhus/execa#env
   *
   * Set environment variables for paths relative to eleventy `input` dir,
   * allowing a project agnostic `quire-11ty` eleventy configuration file.
   * Nota bene: environment variables read into the eleventy configuration
   * file _must_ be set before the eleventy configuration file is parsed.
   */
  const env = {
    ELEVENTY_DATA: paths.data,
    ELEVENTY_INCLUDES: paths.includes,
    ELEVENTY_LAYOUTS: paths.layouts,
  }

  if (options.debug) env.DEBUG = 'Eleventy*'

  return { command, env }
}

/**
 * A wrapper module for using the Eleventy CLI programmatically
 * @see https://www.11ty.dev/docs/usage/#command-line-usage
 */
export default {
  build: async (options = {}) => {
    console.info('[CLI:11ty] running eleventy build')

    const { command, env } = factory(options)

    if (options.dryRun) command.push('--dryrun')

    env.ELEVENTY_ENV = 'production'

    await execa('node', command, {
      all: true,
      cwd: projectRoot,
      env,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  },

  serve: async (options = {}) => {
    console.info(`[CLI:11ty] running eleventy serve`)

    const { command, env } = factory(options)

    command.push('--serve')

    env.ELEVENTY_ENV = 'development'

    if (options.port) command.push(`--port=${options.port}`)

    await execa('node', command, {
      all: true,
      cwd: projectRoot,
      env,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  }
}
