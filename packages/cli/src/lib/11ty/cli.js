import { execa } from 'execa'
import fs from 'node:fs'
import path from 'node:path'
import paths from '#lib/project/index.js'
import { BuildFailedError } from '#src/errors/index.js'

/**
 * A factory function to configure an Eleventy CLI command
 *
 * @param  {Object}  options  Eleventy configuration options
 * @return  {Array} Eleventy CLI options
 */
const factory = (options = {}) => {
  const config = paths.getConfigPath()
  const eleventyRoot = paths.getEleventyRoot()
  const input = paths.getInputDir()
  const output = paths.getOutputDir()
  const projectRoot = paths.getProjectRoot()

  if (options.debug) {
    console.debug('[CLI:11ty] projectRoot %s\n%o', projectRoot, paths.toObject())
  }

  /**
   * Use the version of Eleventy installed to `lib/quire/versions`
   * Nota bene: in eleventy v3 the CLI extension (".cjs") is load-bearing but v2 is simply ".js"
   */
  const eleventyModuleDir = path.join(eleventyRoot, 'node_modules', '@11ty', 'eleventy')
  const packagePath = path.join(eleventyModuleDir,'package.json')

  const pack = JSON.parse(fs.readFileSync(packagePath))

  const { version } = pack

  const eleventyMajorVer = version.split('.').at(0)

  let eleventy = path.join(eleventyModuleDir,'cmd.cjs')

  if ( Number(eleventyMajorVer) < 3 ) {
    eleventy = path.join(eleventyModuleDir,'cmd.js')
  }

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
   * to allow `quire-11ty` to be decouple from the project input directory.
   * Nota bene: environment variables read into the eleventy configuration
   * file _must_ be set before the eleventy configuration file is parsed.
   * @see https://github.com/11ty/eleventy/issues/2655
   */
  const env = {
    ELEVENTY_DATA: paths.getDataDir(),
    ELEVENTY_INCLUDES: paths.getIncludesDir(),
    ELEVENTY_LAYOUTS: paths.getLayoutsDir(),
  }

  if (options.debug) env.DEBUG = 'Eleventy*'

  return { command, env, projectRoot }
}

/**
 * A wrapper module for using the Eleventy CLI programmatically
 * @see https://www.11ty.dev/docs/usage/#command-line-usage
 */
export default {
  build: async (options = {}) => {
    console.info('[CLI:11ty] running eleventy build')

    const { command, env, projectRoot } = factory(options)

    if (options.dryRun) command.push('--dryrun')

    env.ELEVENTY_ENV = 'production'

    const build = execa('node', command, {
      all: true,
      cwd: projectRoot,
      env,
      execPath: process.execPath
    })
    build.all.pipe(process.stdout)
    await build

    if (build.exitCode !== 0) {
      throw new BuildFailedError(`Eleventy exited with code ${build.exitCode}`)
    }
  },

  serve: async (options = {}) => {
    console.info(`[CLI:11ty] running eleventy serve`)

    const { command, env, projectRoot } = factory(options)

    command.push('--serve')

    if (options.port) command.push(`--port=${options.port}`)

    env.ELEVENTY_ENV = 'development'

    await execa('node', command, {
      all: true,
      cwd: projectRoot,
      env,
      execPath: process.execPath
    }).all.pipe(process.stdout)
  }
}
