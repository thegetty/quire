import { dynamicImport } from '#helpers/os-utils.js'
import which from '#helpers/which.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs-extra'
import paths from '#lib/project/index.js'
import reporter from '#lib/reporter/index.js'
import { InvalidEpubLibraryError } from '#src/errors/index.js'
import createDebug from '#debug'
import ENGINE_METADATA from './engines.js'
import { ENGINES } from './schema.js'

export { ENGINES }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:epub')

/**
 * Resolve the EPUB library implementation
 *
 * @param {string} name - Library name to resolve
 * @returns {Object} Resolved engine with absolute module path
 * @throws {InvalidEpubLibraryError} When library name is not recognized
 */
function resolveLibrary(name) {
  const normalizedName = name.replace(/[-_.\s]/g, '').toLowerCase()

  switch (normalizedName) {
    case 'epubjs':
    case 'epub':
      return { ...ENGINE_METADATA.epubjs, path: path.join(__dirname, ENGINE_METADATA.epubjs.module) }
    case 'pandoc':
      return { ...ENGINE_METADATA.pandoc, path: path.join(__dirname, ENGINE_METADATA.pandoc.module) }
    default:
      throw new InvalidEpubLibraryError(name)
  }
}

/**
 * Check if the required binary for an engine is available
 *
 * @param {Object} engine - Engine definition from ENGINES
 * @throws {ToolNotFoundError} When required binary is not in PATH
 */
function checkEngineAvailable(engine) {
  if (!engine.requiresBinary) {
    return // No binary required (e.g., epubjs uses Node.js)
  }

  const result = which(engine.requiresBinary, engine.toolInfo)
  debug('found %s at %s', engine.requiresBinary, result)
}

/**
 * Construct the default output path for the EPUB
 */
function getOutputPath(projectRoot, libName) {
  return path.join(projectRoot, `${libName}.epub`)
}

/**
 * Resolve a custom output path, handling relative paths and ensuring .epub extension
 *
 * @param {string} customOutput - User-provided output path
 * @param {string} projectRoot - Project root directory
 * @returns {string} Resolved absolute path with .epub extension
 */
function resolveOutputPath(customOutput, projectRoot) {
  // Resolve relative paths against project root
  const resolved = path.isAbsolute(customOutput)
    ? customOutput
    : path.join(projectRoot, customOutput)

  // Ensure .epub extension
  return resolved.endsWith('.epub') ? resolved : `${resolved}.epub`
}

/**
 * Generate an EPUB from the built publication
 *
 * @param {Object} options - Generation options
 * @param {string} [options.lib='epubjs'] - EPUB library to use ('epubjs' or 'pandoc')
 * @param {string} [options.output] - Custom output path (relative to project root or absolute)
 * @param {boolean} [options.debug] - Enable debug output
 * @returns {Promise<string>} Absolute path to the generated EPUB file
 */
export default async function generateEpub(options = {}) {
  const libName = options.lib || 'epubjs'
  const lib = resolveLibrary(libName)

  debug('resolved library: %s → %s', libName, lib.name)

  // Check engine availability BEFORE starting reporter (fail fast with clean error)
  checkEngineAvailable(lib)

  const projectRoot = paths.getProjectRoot()
  const inputDir = path.join(projectRoot, paths.getEpubDir())

  // Resolve output path from user option or default to {libName}.epub
  const epubPath = options.output
    ? resolveOutputPath(options.output, projectRoot)
    : getOutputPath(projectRoot, libName)

  // Ensure parent directory exists (epub generators use fs.writeFile directly)
  const epubDir = path.dirname(epubPath)
  if (!fs.existsSync(epubDir)) {
    fs.mkdirSync(epubDir, { recursive: true })
  }

  debug('input: %s', inputDir)
  debug('output: %s', epubPath)

  const { default: epubLib } = await dynamicImport(lib.path)

  reporter.start(`Generating EPUB using ${lib.name}...`, { showElapsed: true })
  reporter.detail(`Input: ${inputDir}`)
  reporter.detail(`Output: ${epubPath}`)

  try {
    await epubLib(inputDir, epubPath, options)
    reporter.succeed(`EPUB saved to ${epubPath}`)
  } catch (error) {
    reporter.fail(`EPUB generation failed`)
    throw error
  }

  return epubPath
}
