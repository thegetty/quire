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
 * @todo read paths from the Quire project configuration and resolve path
 * to the correct version of the quire/11ty package, for example:
 *   eleventyRoot = `#lib/quire/versions/${config.version}/11ty`
 */
const version = quire.getVersion()
export const eleventyRoot = path.join(__dirname, '..', '..', '..', 'src', 'lib', 'quire', 'versions', version)
export const projectRoot = process.cwd()

export default () => {
  return {
    config: path.resolve(eleventyRoot, '.eleventy.js'),
    input: path.relative(eleventyRoot, path.join(projectRoot, 'content')),
    output: './_site',
    public: './public',
  }
}
