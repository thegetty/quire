/**
 * Quire Eleventy integration module
 *
 * Provides a unified façade for Eleventy operations following the singleton
 * pattern established by lib/npm and lib/git. Integrates with the central
 * ProcessManager for graceful shutdown on process signals.
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
import cliModule from './cli.js'
import paths, { Paths } from '#lib/project/index.js'
import processManager from '#lib/process/manager.js'

/**
 * Quire11ty singleton instance
 * @type {Quire11ty}
 */
const eleventy = new Quire11ty(paths)

/**
 * CLI wrapper - delegates to cli.js which imports processManager directly
 */
const cli = {
  build: async (options) => cliModule.build(options),
  serve: async (options) => cliModule.serve(options),
}

/**
 * Legacy API export for backwards compatibility
 *
 * Wraps the singleton methods to register cleanup handlers with
 * ProcessManager for graceful shutdown support.
 *
 * @deprecated Use default export instead: `import eleventy from '#lib/11ty/index.js'`
 */
const api = {
  build: async (options) => eleventy.build(options),
  serve: async (options) => {
    processManager.onShutdown('eleventy', () => eleventy.close())
    try {
      return await eleventy.serve(options)
    } finally {
      processManager.onShutdownComplete('eleventy')
    }
  },
}

// Default export: unified façade
export default eleventy

// Named exports for backwards compatibility and path-only consumers
export {
  api,
  cli,
  paths,
  Paths,
}
