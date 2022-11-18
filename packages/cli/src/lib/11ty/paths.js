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

// Absolute path to the current version of quire-11ty
export const eleventyRoot = hasEleventyConfig(projectRoot)
  ? projectRoot
  : path.resolve(__dirname, path.join(cliRoot, 'lib', 'quire', 'versions', version))

export default {
  config: path.join(eleventyRoot, '.eleventy.js'),
  input: path.relative(eleventyRoot, path.join(projectRoot, 'content')),
  output: path.relative(eleventyRoot, path.join(projectRoot, '_site')),
  public: './public',
}
