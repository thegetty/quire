import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Eleventy path configuration
 *
 * Provides accessor methods for Eleventy paths, computing values on access
 * to ensure they reflect the current working directory state.
 *
 * Naming convention:
 * - Methods ending in `Path` or `Root` return absolute paths
 * - Methods ending in `Dir` return relative directory names
 *
 * @see https://www.11ty.dev/docs/config/#configuration-options
 */
class Paths {
  /**
   * @param {Object} options
   * @param {string} [options.version='latest'] - quire-11ty version to use
   */
  constructor(options = {}) {
    this.cliRoot = path.resolve(__dirname, path.join('..', '..'))
    this.eleventyConfig = '.eleventy.js'
    this.version = options.version || 'latest'
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Implicit getters for domain-specific grouping of paths
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Eleventy configuration paths
   */
  get eleventy() {
    return {
      config: this.getConfigPath(),
      data: this.getDataDir(),
      includes: this.getIncludesDir(),
      input: this.getInputDir(),
      layouts: this.getLayoutsDir(),
      output: this.getOutputDir(),
      root: this.getEleventyRoot(),
    }
  }

  /**
   * Output format-specific paths
   */
  get output() {
    return {
      site: this.getOutputDir(),
      epub: this.getEpubDir(),
      public: this.getPublicDir(),
    }
  }

  /**
   * Project root paths (general)
   */
  get project() {
    return {
      content: this.getInputPath(),
      root: this.getProjectRoot(),
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Absolute paths (method names ends with Path or Root)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get the absolute path to eleventy config module
   * @returns {string} Absolute path to .eleventy.js
   */
  getConfigPath() {
    return path.join(this.getEleventyRoot(), this.eleventyConfig)
  }

  /**
   * Get the Eleventy root directory
   *
   * @todo refactor how and *when* the eleventyRoot is determined:
   *  - we only need eleventyRoot for cli commands that run 11ty
   *  - paths module is a concern of the `quire` module
   *  - global quire-cli installation
   *  - local quire-cli installation
   *
   * @returns {string} Absolute path to Eleventy root
   */
  getEleventyRoot() {
    return this.getProjectRoot()
  }

  /**
   * Get the absolute path to content input directory
   * @returns {string} Absolute path to content directory
   */
  getInputPath() {
    return path.join(this.getProjectRoot(), 'content')
  }

  /**
   * Get the path to installed quire-11ty version
   * @returns {string} Absolute path to quire-11ty installation
   */
  getLibQuirePath() {
    return path.resolve(
      __dirname,
      path.join(this.cliRoot, 'lib', 'quire', 'versions', this.version)
    )
  }

  /**
   * Get the current project root directory
   * @returns {string} Absolute path to project root
   */
  getProjectRoot() {
    return process.cwd()
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Relative directory names (method names ends with Dir)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get data directory relative to input
   * @returns {string} Relative directory name for computed data
   */
  getDataDir() {
    return '_computed'
  }

  /**
   * Get epub output directory relative to eleventy config
   * @returns {string} Relative directory name for epub output (_epub)
   */
  getEpubDir() {
    return path.relative(
      this.getEleventyRoot(),
      path.join(this.getProjectRoot(), '_epub')
    )
  }

  /**
   * Get includes directory relative to input
   * @returns {string} Relative directory name for _includes
   */
  getIncludesDir() {
    return path.relative(
      this.getInputPath(),
      path.join(this.getEleventyRoot(), '_includes')
    )
  }

  /**
   * Get input directory relative to eleventy config
   * @returns {string} Relative directory name for 11ty input
   */
  getInputDir() {
    return path.relative(this.getEleventyRoot(), this.getInputPath())
  }

  /**
   * Get layouts directory relative to input
   * @returns {string} Relative directory name for _layouts
   */
  getLayoutsDir() {
    return path.relative(
      this.getInputPath(),
      path.join(this.getEleventyRoot(), '_layouts')
    )
  }

  /**
   * Get output directory relative to eleventy config
   * @returns {string} Relative directory name for 11ty output (_site)
   */
  getOutputDir() {
    return path.relative(
      this.getEleventyRoot(),
      path.join(this.getProjectRoot(), '_site')
    )
  }

  /**
   * Get public assets directory
   * @returns {string} Relative directory name for public assets
   */
  getPublicDir() {
    return './public'
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Utility methods
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get all paths as an object (for backward compatibility and logging)
   * @returns {Object} Object containing all path values
   */
  toObject() {
    return {
      config: this.getConfigPath(),
      data: this.getDataDir(),
      epub: this.getEpubDir(),
      includes: this.getIncludesDir(),
      input: this.getInputDir(),
      layouts: this.getLayoutsDir(),
      output: this.getOutputDir(),
      public: this.getPublicDir(),
    }
  }
}

/**
 * Default Paths instance
 */
const paths = new Paths()

export { Paths, paths as default }
