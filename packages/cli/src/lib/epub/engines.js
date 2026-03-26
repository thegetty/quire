/**
 * EPUB Engine Registry
 *
 * Centralized metadata for EPUB engines. Each engine module re-exports
 * its metadata from here, ensuring single source of truth.
 *
 * The façade imports this registry to:
 * 1. Resolve engine names to implementations
 * 2. Check binary availability before loading heavy modules
 * 3. Provide helpful error messages with install URLs
 */
import QuireError from '#src/errors/quire-error.js'

/**
 * @typedef {Object} EngineMetadata
 * @property {string} name - Human-readable display name
 * @property {string} module - Module filename (e.g., 'epub.js')
 * @property {string|null} requiresBinary - CLI binary name, or null if built-in
 * @property {Object} [toolInfo] - Error metadata (only for engines requiring binaries)
 * @property {string} [toolInfo.displayName] - Display name for error messages
 * @property {string} [toolInfo.installUrl] - URL to download the tool
 * @property {string} [toolInfo.docsUrl] - Quire docs URL
 * @property {string} [toolInfo.fallback] - Alternative suggestion
 */

/** @type {Record<string, EngineMetadata>} */
const ENGINES = {
  epubjs: {
    name: 'Epub.js',
    module: 'epub.js',
    requiresBinary: null, // Built-in Node.js library
  },
  pandoc: {
    name: 'Pandoc',
    module: 'pandoc.js',
    requiresBinary: 'pandoc',
    toolInfo: {
      displayName: 'Pandoc',
      installUrl: 'https://pandoc.org/installing.html',
      docsUrl: `${QuireError.DOCS_BASE}/epub-output/`,
      fallback: 'Or use the default EPUB engine: quire epub --engine epubjs',
    },
  },
}

export default ENGINES
