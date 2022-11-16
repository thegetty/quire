import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { quire } from '#src/lib/quire/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Eleventy configuration paths
 * @see https://www.11ty.dev/docs/config/#configuration-options
 *
 * Resolve the absolute path to the Eleventy configuration module,
 * `eleventyRoot` is _relative_ to the CLI entry point, `bin/cli.js`
 * Both `input` and `output` are _relative_ to the `config` module.
 *
 * @todo
 * - refactor the paths module as a concern of the `lib/quire` module
 * - refactor resolving an absolute path to the correct eleventy version root;
 *   this needs to use the correct `quire-11ty` version for the project
 *   and correctly resolve the path to the target of the 'latest' symlink
 */
const cliRoot = path.resolve(__dirname, path.join('..', '..'))
const version = 'latest'

// Absolute path to the current version of quire-11ty
export const eleventyRoot =
  path.resolve(__dirname, path.join(cliRoot, 'lib', 'quire', 'versions', version))
export const projectRoot = process.cwd()

export default {
  config: path.join(eleventyRoot, '.eleventy.js'),
  input: path.relative(eleventyRoot, path.join(projectRoot, 'content')),
  output: path.relative(eleventyRoot, path.join(projectRoot, '_site')),
  public: './public',
}
