/**
 * PDF output check
 *
 * Checks for PDF output files using the same path resolution logic as the
 * PDF generation command. Supports both default engine-named paths and
 * config-aware custom output paths.
 *
 * @module lib/doctor/checks/outputs/pdf-output
 */
import fs from 'node:fs'
import path from 'node:path'
import createDebug from '#debug'
import { getPdfOutputPaths } from '#lib/project/output-paths.js'
import { DOCS_BASE_URL } from '../../constants.js'
import { formatDuration } from '../../formatDuration.js'

const debug = createDebug('lib:doctor:pdf-output')

/**
 * Check if PDF output exists and is up to date with _site
 *
 * PDF is generated from _site, so if _site is newer than the PDF,
 * the PDF is considered stale.
 *
 * Uses the same path resolution as `lib/pdf/index.js` to find PDF files
 * at both default locations ({engine}.pdf) and config-aware locations.
 *
 * @param {Object} [options]
 * @param {Object} [options.pdfConfig] - PDF config from config.yaml (config.pdf)
 * @returns {import('../../index.js').CheckResult}
 */
export function checkPdfOutput(options = {}) {
  const { pdfConfig } = options

  // Get all possible PDF paths (config-aware + engine defaults)
  const candidatePaths = getPdfOutputPaths({ pdfConfig })
  debug('candidate PDF paths: %o', candidatePaths)

  // Find which PDF files actually exist
  const existingPdfs = candidatePaths.filter((p) => fs.existsSync(p))

  if (existingPdfs.length === 0) {
    debug('No PDF files found')
    return {
      ok: true,
      level: 'na',
      message: 'No PDF output found',
      remediation: `Run "quire pdf" to generate a PDF.
    • If you already ran "quire pdf" and it failed, check the output for errors`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#pdf`,
    }
  }

  // Use basenames for display
  const existingNames = existingPdfs.map((p) => path.basename(p))
  debug('found PDF files: %o', existingNames)

  // Check if _site exists
  if (!fs.existsSync('_site')) {
    debug('_site directory not found')
    return {
      ok: true,
      message: `${existingNames.join(', ')} exists (no _site to compare)`,
    }
  }

  // Get _site last modified time
  const { mtimeMs: siteLastModified } = fs.statSync('_site')
  debug('_site lastModified: %d', siteLastModified)

  // Check each PDF for staleness
  const staleFiles = []
  let oldestPdfLastModified = Infinity

  for (const pdfFile of existingPdfs) {
    const { mtimeMs: pdfLastModified } = fs.statSync(pdfFile)
    debug('%s lastModified: %d', path.basename(pdfFile), pdfLastModified)

    if (siteLastModified > pdfLastModified) {
      staleFiles.push(pdfFile)
      if (pdfLastModified < oldestPdfLastModified) {
        oldestPdfLastModified = pdfLastModified
      }
    }
  }

  if (staleFiles.length > 0) {
    const staleDuration = formatDuration(siteLastModified - oldestPdfLastModified)
    const staleNames = staleFiles.map((p) => path.basename(p))
    const fileList = staleNames.join(', ')
    return {
      ok: false,
      level: 'warn',
      message: `${fileList} is ${staleDuration} older than _site`,
      remediation: `Your PDF may not reflect recent build changes.
    • Run "quire pdf" to regenerate the PDF
    • Or delete the old PDF files and run "quire pdf"`,
      docsUrl: `${DOCS_BASE_URL}/quire-commands/#pdf`,
    }
  }

  // All PDFs are up to date
  const fileList = existingNames.join(', ')
  return {
    ok: true,
    message: `${fileList} up to date`,
  }
}

export default checkPdfOutput
