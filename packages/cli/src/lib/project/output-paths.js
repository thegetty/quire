/**
 * Output path resolution module
 *
 * Centralizes knowledge of where PDF and EPUB output files are located.
 * Used by the doctor command and build detection to find output artifacts
 * using the same logic as the generation commands.
 *
 * @module lib/project/output-paths
 */
import path from 'node:path'
import { ENGINES as PDF_ENGINES } from '#lib/pdf/schema.js'
import { ENGINES as EPUB_ENGINES } from '#lib/epub/schema.js'

export { PDF_ENGINES, EPUB_ENGINES }

/**
 * Get all possible PDF output file paths for a project
 *
 * PDF output paths depend on configuration:
 * - With config.pdf: `{outputDir}/{config.pdf.outputDir}/{config.pdf.filename}.pdf`
 * - Without config (default): `{projectRoot}/{engine}.pdf`
 *
 * This reuses the same resolution logic as `lib/pdf/index.js#getOutputPath`.
 *
 * @param {Object} [options]
 * @param {string} [options.projectRoot=process.cwd()] - Project root directory
 * @param {string} [options.outputDir='_site'] - Build output directory (relative)
 * @param {Object} [options.pdfConfig] - PDF config from config.yaml (config.pdf)
 * @param {string} [options.pdfConfig.outputDir] - PDF output subdirectory
 * @param {string} [options.pdfConfig.filename] - PDF filename (without extension)
 * @returns {string[]} Array of absolute paths to check for PDF output
 */
export function getPdfOutputPaths(options = {}) {
  const {
    projectRoot = process.cwd(),
    outputDir = '_site',
    pdfConfig,
  } = options

  const paths = []

  if (pdfConfig && pdfConfig.outputDir && pdfConfig.filename) {
    // Config-aware path: matches lib/pdf/index.js getOutputPath()
    paths.push(
      path.join(projectRoot, outputDir, pdfConfig.outputDir, `${pdfConfig.filename}.pdf`)
    )
  }

  // Default engine-named paths (always check these as fallback)
  for (const engine of PDF_ENGINES) {
    paths.push(path.join(projectRoot, `${engine}.pdf`))
  }

  return paths
}

/**
 * Get all possible EPUB output file paths for a project
 *
 * EPUB output is at `{projectRoot}/{engine}.epub` for each supported engine.
 * The `_epub` directory is an intermediate build artifact, not the final output.
 *
 * This reuses the same resolution logic as `commands/epub.js`.
 *
 * @param {Object} [options]
 * @param {string} [options.projectRoot=process.cwd()] - Project root directory
 * @returns {string[]} Array of absolute paths to check for EPUB output
 */
export function getEpubOutputPaths(options = {}) {
  const { projectRoot = process.cwd() } = options

  return EPUB_ENGINES.map(
    (engine) => path.join(projectRoot, `${engine}.epub`)
  )
}

/**
 * Get the intermediate EPUB build directory path
 *
 * @param {Object} [options]
 * @param {string} [options.projectRoot=process.cwd()] - Project root directory
 * @returns {string} Absolute path to _epub directory
 */
export function getEpubBuildDir(options = {}) {
  const { projectRoot = process.cwd() } = options
  return path.join(projectRoot, '_epub')
}
