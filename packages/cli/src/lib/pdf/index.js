import { dynamicImport } from '#helpers/os-utils.js'
import which from '#helpers/which.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs-extra'
import paths, { loadProjectConfig } from '#lib/project/index.js'
import reporter from '#lib/reporter/index.js'
import { InvalidPdfLibraryError, MissingBuildOutputError } from '#src/errors/index.js'
import ENGINES from './engines.js'
import createDebug from '#debug'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:pdf')

/**
 * Resolve the PDF library implementation
 *
 * @param {string} name - Library name to resolve
 * @returns {Object} Resolved engine with absolute module path
 * @throws {InvalidPdfLibraryError} When library name is not recognized
 */
function resolveLibrary(name) {
  const normalizedName = name.replace(/[-_.\s]/g, '').toLowerCase()

  switch (normalizedName) {
    case 'paged':
    case 'pagedjs':
      return { ...ENGINES.pagedjs, path: path.join(__dirname, ENGINES.pagedjs.module) }
    case 'prince':
    case 'princexml':
      return { ...ENGINES.prince, path: path.join(__dirname, ENGINES.prince.module) }
    default:
      throw new InvalidPdfLibraryError(name)
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
    return // No binary required (e.g., pagedjs uses Node.js)
  }

  const result = which(engine.requiresBinary, engine.toolInfo)
  debug('found %s at %s', engine.requiresBinary, result)
}

/**
 * Construct the default output path for the PDF from project config
 *
 * @param {string} projectRoot - Project root directory
 * @param {string} outputDir - Build output directory
 * @param {Object} [pdfConfig] - PDF configuration from project config
 * @param {string} libName - Library name for fallback filename
 * @returns {string} Default output path
 */
function getDefaultOutputPath(projectRoot, outputDir, pdfConfig, libName) {
  if (pdfConfig) {
    return path.join(projectRoot, outputDir, pdfConfig.outputDir, `${pdfConfig.filename}.pdf`)
  }
  return path.join(projectRoot, `${libName}.pdf`)
}

/**
 * Resolve the final output path, allowing CLI override
 *
 * @param {string} [userOutput] - User-specified output path from --output option
 * @param {string} defaultPath - Default path from project config
 * @param {string} projectRoot - Project root for resolving relative paths
 * @returns {string} Resolved absolute output path
 */
function resolveOutputPath(userOutput, defaultPath, projectRoot) {
  if (!userOutput) {
    return defaultPath
  }

  // Resolve relative paths against project root
  if (path.isAbsolute(userOutput)) {
    return userOutput
  }

  return path.join(projectRoot, userOutput)
}

/**
 * Generate a PDF from the built publication
 *
 * @param {Object} options - Generation options
 * @param {string} [options.lib='pagedjs'] - PDF library to use ('pagedjs' or 'prince')
 * @param {string} [options.output] - Custom output path (overrides project config)
 * @param {boolean} [options.debug] - Enable debug output
 * @returns {Promise<string>} Absolute path to the generated PDF file
 */
export default async function generatePdf(options = {}) {
  const libName = options.lib || 'pagedjs'
  const lib = resolveLibrary(libName)

  debug('resolved library: %s → %s', libName, lib.name)

  // Check engine availability BEFORE starting reporter (fail fast with clean error)
  checkEngineAvailable(lib)

  const projectRoot = paths.getProjectRoot()
  const buildOutputDir = paths.getOutputDir()
  const config = await loadProjectConfig(projectRoot)

  const publicationInput = path.join(projectRoot, buildOutputDir, 'pdf.html')
  const coversInput = path.join(projectRoot, buildOutputDir, 'pdf-covers.html')

  debug('input: %s', publicationInput)
  debug('covers: %s', coversInput)

  if (!fs.existsSync(publicationInput)) {
    throw new MissingBuildOutputError('pdf.html', publicationInput)
  }

  const defaultPath = getDefaultOutputPath(projectRoot, buildOutputDir, config.pdf, libName)
  const pdfPath = resolveOutputPath(options.output, defaultPath, projectRoot)
  debug('output: %s (user: %s, default: %s)', pdfPath, options.output || 'none', defaultPath)

  const { default: pdfLib } = await dynamicImport(lib.path)

  reporter.start(`Generating PDF using ${lib.name}...`, { showElapsed: true })
  reporter.detail(`Input: ${publicationInput}`)
  reporter.detail(`Output: ${pdfPath}`)

  try {
    await pdfLib(publicationInput, coversInput, pdfPath, { ...options, pdfConfig: config.pdf })
    reporter.succeed(`PDF saved to ${pdfPath}`)
  } catch (error) {
    reporter.fail(`PDF generation failed`)
    throw error
  }

  return pdfPath
}
