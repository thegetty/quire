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

export const projectRoot = process.cwd()

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
 *
 * @todo refactor how and *when* the eleventyRoot is determined:
 *  - we only need eleventyRoot for cli commands that run 11ty
 *  - paths module is a concern of the `quire` module
 *  - global quire-cli installation
 *  - local quire-cli installation
 *
 *  For an excellent developer experience, the quire-11ty code should be
 *  installed into an `11ty` or `quire-11ty` directory in the `projectRoot`
 *  this will allow us to more easily manage symlinks for local development
 *  using unpublished `quire-11ty` code.
 *  @example
 *  ```sh
 *  blargh/
 *    .git/
 *    .gitignore
 *    .node-version
 *    .quire-version
 *    11ty@ --> /Users/mph/Code/Getty/quire/packages/11ty
 *    content/
 *    CHANGELOG.md
 *    LICENSE
 *    README.md
 *    package.json
 *    package-lock.json
 *  ```
 *  Installing to a directory will allow more cleanly `eject` and `uneject`
 *  using a symlink or single directory `rm -rf`.
 *  Should the `11ty` directory be a dot directory to hide the complexity from
 *  users or should it be visible to be more explicit when project is ejected?
 */
const getEleventyRoot = () => {
  // try {
  //   return fs.readdirSync(projectRoot).includes(eleventyConfig)
  //     ? projectRoot
  //     : fs.realpathSync(libQuirePath)
  // } catch (error) {
  //   throw new Error(`[CLI:11ty] Unable to read project directory for eleventy config ${error}`)
  // }
  return path.join(projectRoot, '11ty')
}

export const eleventyRoot = getEleventyRoot()

const inputDir = path.join(projectRoot, 'content')

export default {
  /**
   * An abolsute path to eleventy config module
   */
  config: path.join(eleventyRoot, '.eleventy.js'),
  /**
   * Paths _relative to_ the eleventy config module
   */
  input: path.relative(eleventyRoot, inputDir),
  output: path.relative(eleventyRoot, path.join(projectRoot, '_site')),
  epub: path.relative(eleventyRoot, path.join(projectRoot, '_epub')),
  /**
   * Paths _relative to_ the `input` directory
   */
  data: '_computed',
  includes: path.relative(inputDir, path.join(eleventyRoot, '_includes')),
  layouts: path.relative(inputDir, path.join(eleventyRoot, '_layouts')),
  public: './public',
}
