import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Eleventy configuration paths
 * @see https://www.11ty.dev/docs/config/#configuration-options
 *
 * Resolve the absolute path to the Eleventy configuration module,
 * `eleventyRoot` is _relative_ to `main.js`, the CLI entry point.
 * Both `input` and `output` are _relative_ to the `config` module.
 *
 * @todo
 * - refactor the paths module as a concern of the `lib/quire` module
 * - refactor resolving an absolute path to the correct eleventy version root;
 *   this needs to use the correct `quire-11ty` version for the project
 *   and correctly resolve the path to the target of the 'latest' symlink
 */
const cliRoot = path.resolve(__dirname, path.join('..', '..'))
const eleventyConfig = '.eleventy.js'
const version = 'latest'

// Test project directory for an eleventy configuration file
const hasEleventyConfig = (dir) => {
  try {
    return fs.readdirSync(dir).includes(eleventyConfig)
  } catch (error) {
    throw new Error(`[CLI:11ty] Unable to read project directory for eleventy config ${error}`)
  }
}

export const projectRoot = process.cwd()

const inputDir = path.join(projectRoot, 'content')

/**
 * Absolute path to the latest installed version of `quire-11ty`
 * @todo use version read from the project `.quire-version` file
 */
const libQuirePath = path.resolve(__dirname, path.join(cliRoot, 'lib', 'quire', 'versions', version))

/**
 * Absolute path to the current version of `quire-11ty`
 * Nota bene: to get a relative path to the `eleventyRoot`,
 * for example when the version is specified is 'latest',
 * it must be set to the real path to the symlink target.
 */
export const eleventyRoot = hasEleventyConfig(projectRoot)
  ? projectRoot
  : fs.realpathSync(libQuirePath)

export default {
  config: path.join(eleventyRoot, '.eleventy.js'),
  input: path.relative(eleventyRoot, inputDir),
  output: path.relative(eleventyRoot, path.join(projectRoot, '_site')),
  data: path.relative(inputDir, path.join(eleventyRoot, '_computed')),
  includes: path.relative(inputDir, path.join(eleventyRoot, '_includes')),
  layouts: path.relative(inputDir, path.join(eleventyRoot, '_layouts')),
  public: './public',
}
