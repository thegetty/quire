import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs-extra'
import paths, { loadProjectConfig } from '#lib/project/index.js'
import { logger } from '#lib/logger/index.js'
import { InvalidPdfLibraryError, MissingBuildOutputError } from '#src/errors/index.js'
import createDebug from '#debug'
import { ENGINES } from './schema.js'

export { ENGINES }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:pdf')

/**
 * Resolve the PDF library implementation
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
      return null
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
 */
export default async function generatePdf(options = {}) {
  const libName = options.lib || 'pagedjs'
  const lib = resolveLibrary(libName)

  if (!lib) {
    throw new InvalidPdfLibraryError(libName)
  }

  debug('resolved library: %s → %s', libName, lib.name)

  const projectRoot = paths.getProjectRoot()
  const outputDir = paths.getOutputDir()
  const config = await loadProjectConfig(projectRoot)

  const publicationInput = path.join(projectRoot, outputDir, 'pdf.html')
  const coversInput = path.join(projectRoot, outputDir, 'pdf-covers.html')

  debug('input: %s', publicationInput)
  debug('covers: %s', coversInput)

  if (!fs.existsSync(publicationInput)) {
    throw new MissingBuildOutputError('pdf.html', publicationInput)
  }

  const output = getOutputPath(projectRoot, outputDir, config.pdf, libName)
  debug('output: %s', output)

  const { default: pdfLib } = await dynamicImport(lib.path)

  logger.info(`Generating PDF using ${lib.name}...`)
  await pdfLib(publicationInput, coversInput, output, { ...options, pdfConfig: config.pdf })

  logger.info(`PDF saved to ${output}`)
  return output
}
