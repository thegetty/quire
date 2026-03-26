/**
 * PDF Engine Registry
 *
 * Centralized metadata for PDF engines. Each engine module re-exports
 * its metadata from here, ensuring single source of truth.
 *
 * The façade imports this registry to:
 * 1. Resolve engine names to implementations
 * 2. Check binary availability before loading heavy modules
 * 3. Provide helpful error messages with install URLs
 */
import { docsUrl } from '#helpers/docs-url.js'

/**
 * @typedef {Object} EngineMetadata
 * @property {string} name - Human-readable display name
 * @property {string} module - Module filename (e.g., 'paged.js')
 * @property {string|null} requiresBinary - CLI binary name, or null if built-in
 * @property {Object} [toolInfo] - Error metadata (only for engines requiring binaries)
 * @property {string} [toolInfo.displayName] - Display name for error messages
 * @property {string} [toolInfo.installUrl] - URL to download the tool
 * @property {string} [toolInfo.docsUrl] - Quire docs URL
 * @property {string} [toolInfo.fallback] - Alternative suggestion
 */

/** @type {Record<string, EngineMetadata>} */
const ENGINES = {
  pagedjs: {
    name: 'Paged.js',
    module: 'paged.js',
    requiresBinary: null, // Built-in Node.js library
  },
  prince: {
    name: 'Prince',
    module: 'prince.js',
    requiresBinary: 'prince',
    toolInfo: {
      displayName: 'PrinceXML',
      installUrl: 'https://www.princexml.com/download/',
      docsUrl: docsUrl('pdf-output'),
      fallback: 'Or use the default PDF engine: quire pdf --engine pagedjs',
    },
  },
}

export default ENGINES
