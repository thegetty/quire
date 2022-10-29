import { fileURLToPath } from 'node:url'
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
 * @todo read paths from the Quire project configuration and resolve path
 * to the correct version of the quire/11ty package, for example:
 *   eleventyRoot = `#lib/quire/versions/${config.version}/11ty`
 */
export const eleventyRoot = '../../packages/11ty'

export default {
  config: path.resolve(eleventyRoot, '.eleventy.js'),
  input: './content',
  output: './_site',
  public: './public',
}
