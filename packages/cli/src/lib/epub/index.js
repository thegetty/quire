import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs-extra'
import paths from '#lib/project/index.js'
import { InvalidEpubLibraryError } from '#src/errors/index.js'
import { logger } from '#lib/logger/index.js'
import createDebug from '#debug'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:epub')

/**
 * Resolve the EPUB library implementation
 *
 * @param {string} name - Library name to resolve
 * @returns {{ name: string, path: string }} Resolved library info
 * @throws {InvalidEpubLibraryError} When library name is not recognized
 */
function resolveLibrary(name) {
  const normalizedName = name.replace(/[-_.\s]/g, '').toLowerCase()

  switch (normalizedName) {
    case 'epubjs':
      return { name: 'Epub.js', path: path.join(__dirname, 'epub.js') }
    case 'pandoc':
      return { name: 'Pandoc', path: path.join(__dirname, 'pandoc.js') }
    default:
      throw new InvalidEpubLibraryError(name)
  }
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
 */
export default async function generateEpub(options = {}) {
  const libName = options.lib || 'epubjs'
  const lib = resolveLibrary(libName)

  debug('resolved library: %s → %s', libName, lib.name)

  const projectRoot = paths.getProjectRoot()
  const input = path.join(projectRoot, paths.getEpubDir())

  // Use custom output path if provided, otherwise use default
  const output = options.output
    ? resolveOutputPath(options.output, projectRoot)
    : getOutputPath(projectRoot, libName)

  // Ensure parent directory exists (epub generators use fs.writeFile directly)
  const outputDir = path.dirname(output)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  debug('input: %s', input)
  debug('output: %s', output)

  const { default: epubLib } = await dynamicImport(lib.path)

  logger.info(`Generating EPUB using ${lib.name}...`)
  await epubLib(input, output, options)

  logger.info(`EPUB saved to ${output}`)
  return output
}
