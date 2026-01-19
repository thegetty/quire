/**
 * PDF output check
 *
 * @module lib/doctor/checks/outputs/pdf-output
 */
import fs from 'node:fs'
import createDebug from '#debug'
import { DOCS_BASE_URL } from '../../constants.js'
import { formatDuration } from '../../formatDuration.js'

const debug = createDebug('lib:doctor:pdf-output')

/**
 * PDF output file names by library
 */
const PDF_FILES = ['pagedjs.pdf', 'prince.pdf']

/**
 * Check if PDF output exists and is up to date with _site
 *
 * PDF is generated from _site, so if _site is newer than PDF,
 * the PDF is considered stale.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkPdfOutput() {
  // Find existing PDF files
  const existingPdfs = PDF_FILES.filter((file) => fs.existsSync(file))

  if (existingPdfs.length === 0) {
    debug('No PDF files found')
    return {
      ok: true,
      message: 'No PDF output (run quire pdf to generate)',
    }
  }

  debug('Found PDF files: %o', existingPdfs)

  // Check if _site exists
  if (!fs.existsSync('_site')) {
    debug('_site directory not found')
    return {
      ok: true,
      message: `${existingPdfs.join(', ')} exists (no _site to compare)`,
    }
  }

  // Get _site mtime
  const siteStat = fs.statSync('_site')
  const siteMtime = siteStat.mtimeMs
  debug('_site mtime: %d', siteMtime)

  // Check each PDF for staleness
  const staleFiles = []
  let oldestPdfMtime = Infinity

  for (const pdfFile of existingPdfs) {
    const pdfStat = fs.statSync(pdfFile)
    const pdfMtime = pdfStat.mtimeMs
    debug('%s mtime: %d', pdfFile, pdfMtime)

    if (siteMtime > pdfMtime) {
      staleFiles.push(pdfFile)
      if (pdfMtime < oldestPdfMtime) {
        oldestPdfMtime = pdfMtime
      }
    }
  }

  if (staleFiles.length > 0) {
    const staleDuration = formatDuration(siteMtime - oldestPdfMtime)
    const fileList = staleFiles.join(', ')
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
  const fileList = existingPdfs.join(', ')
  return {
    ok: true,
    message: `${fileList} up to date`,
  }
}

export default checkPdfOutput
