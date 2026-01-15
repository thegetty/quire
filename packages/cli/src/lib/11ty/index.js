/**
 * Quire Eleventy integration module
 *
 * Provides a unified façade for Eleventy operations following the singleton
 * pattern established by lib/npm and lib/git.
 *
 * @example Recommended usage
 * import eleventy from '#lib/11ty/index.js'
 * await eleventy.build({ debug: true })
 * const outputDir = eleventy.paths.getOutputDir()
 *
 * @example Path-only usage (for consumers that only need paths)
 * import { paths } from '#lib/11ty/index.js'
 * const projectRoot = paths.getProjectRoot()
 *
 * @example Legacy usage (deprecated)
 * import { api, cli, paths } from '#lib/11ty/index.js'
 *
 * @module lib/11ty
 */
import { Quire11ty } from './api.js'
import paths, { Paths } from '#lib/project/index.js'

/**
 * Legacy API export for backwards compatibility
 * @deprecated Use default export instead: `import eleventy from '#lib/11ty/index.js'`
 */
const api = {
  build: async (options) => eleventy.build(options),
  serve: async (options) => eleventy.serve(options),
}

/**
 * Quire11ty singleton instance
 * @type {Quire11ty}
 */
const eleventy = new Quire11ty(paths)

// Default export: unified façade
export default eleventy

// Named exports for backwards compatibility and path-only consumers
export {
  api,
  cli,
  paths,
  Paths,
}
