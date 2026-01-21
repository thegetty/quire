import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs-extra'
import paths, { loadProjectConfig } from '#lib/project/index.js'
import reporter from '#lib/reporter/index.js'
import { InvalidPdfLibraryError, MissingBuildOutputError } from '#src/errors/index.js'
import createDebug from '#debug'
import { ENGINES } from './schema.js'

export { ENGINES }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:pdf')

/**
 * Resolve the PDF library implementation
 *
 * @param {string} name - Library name to resolve
 * @returns {{ name: string, path: string }} Resolved library info
 * @throws {InvalidPdfLibraryError} When library name is not recognized
 */
function resolveLibrary(name) {
  const normalizedName = name.replace(/[-_.\s]/g, '').toLowerCase()

  switch (normalizedName) {
    case 'paged':
    case 'pagedjs':
      return { name: 'Paged.js', path: path.join(__dirname, 'paged.js') }
    case 'prince':
    case 'princexml':
      return { name: 'Prince', path: path.join(__dirname, 'prince.js') }
    default:
      throw new InvalidPdfLibraryError(name)
  }
}

/**
 * Construct the output path for the PDF
 */
function getOutputPath(projectRoot, outputDir, pdfConfig, libName) {
  if (pdfConfig) {
    return path.join(projectRoot, outputDir, pdfConfig.outputDir, `${pdfConfig.filename}.pdf`)
  }
  return path.join(projectRoot, `${libName}.pdf`)
}

/**
 * Generate a PDF from the built publication
 *
 * @param {Object} options - Generation options
 * @param {string} [options.lib='pagedjs'] - PDF library to use ('pagedjs' or 'prince')
 * @param {boolean} [options.debug] - Enable debug output
 * @returns {Promise<string>} Absolute path to the generated PDF file
 */
export default async function generatePdf(options = {}) {
  const libName = options.lib || 'pagedjs'
  const lib = resolveLibrary(libName)

  debug('resolved library: %s → %s', libName, lib.name)

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

  const pdfPath = getOutputPath(projectRoot, buildOutputDir, config.pdf, libName)
  debug('output: %s', pdfPath)

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
