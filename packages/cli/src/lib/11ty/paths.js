import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Eleventy configuration paths
 * @see https://www.11ty.dev/docs/config/#configuration-options
 *
 * Resolve the absolute path to the Eleventy configuration module,
 * the `basePath` is _relative_ to `main.js`, the CLI entry point.
 * Both `input` and `output` dirs are _relative_ to the `config` module.
 *
 * @todo read paths from the Quire project configuration
 */
const basePath = '../../packages/11ty'

export default {
  config: path.resolve(basePath, '.eleventy.js'),
  input: './content',
  output: './_site'
}
