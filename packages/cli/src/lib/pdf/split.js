import path from 'node:path'
import { PDFDocument } from 'pdf-lib'
import { paths } from '#lib/11ty/index.js'
import { PdfGenerationError } from '#src/errors/index.js'
import createDebug from '#debug'

const debug = createDebug('lib:pdf:split')

/**
 * Split a PDF into sections based on a page map
 *
 * @param {ArrayBuffer} file - PDF file to split
 * @param {ArrayBuffer} [coversFile] - Optional covers PDF file
 * @param {Object} pageMap - Map of page IDs to page ranges
 * @param {Object} [pdfConfig] - PDF configuration from project config
 * @returns {Promise<Object>} Map of file paths to PDF binary data
 * @throws {PdfGenerationError} When PDF loading or manipulation fails
 */
export async function splitPdf(file, coversFile, pageMap, pdfConfig) {

  if (!pdfConfig) {
    debug('No pdfConfig provided, PDF splitting skipped.')
    return {}
  }

  const { filename, outputDir } = pdfConfig

  debug('loading main PDF')
  let pdfDoc
  try {
    pdfDoc = await PDFDocument.load(file)
  } catch (error) {
    throw new PdfGenerationError('pdf-lib', 'load main PDF', error.message)
  }
  debug('main PDF loaded: %d pages', pdfDoc.getPageCount())

  let coversDoc
  if (coversFile !== undefined) {
    debug('loading covers PDF')
    try {
      coversDoc = await PDFDocument.load(coversFile)
    } catch (error) {
      throw new PdfGenerationError('pdf-lib', 'load covers PDF', error.message)
    }
    debug('covers PDF loaded: %d pages', coversDoc.getPageCount())
  }

  let resultFiles = {}
  const pageEntries = Object.entries(pageMap)
  debug('splitting into %d sections', pageEntries.length)

  for (const [pageId, pageConfig] of pageEntries) {
    const { endPage, startPage, coverPage } = pageConfig

    try {
      // TODO: Set the PDF's sectional doc metadata

      const sectionDoc = await pdfDoc.copy()

      for (let p = pdfDoc.getPageCount() - 1; p > endPage; --p) {
        sectionDoc.removePage(p)
      }
      for (let q = startPage - 1; q >= 0; --q) {
        sectionDoc.removePage(q)
      }

      if (coversDoc && coverPage !== undefined && coverPage >= 0) {
        // copyPages sets page sizing and other metadata on the target PDF
        const cover = await sectionDoc.copyPages(coversDoc, [coverPage])
        sectionDoc.insertPage(0, cover[0])
      }

      const section = await sectionDoc.save()

      const sectionId = pageId.replace(/^page-/g, '')
      const sectionFn = `${filename}-${sectionId}.pdf`
      const sectionFp = path.join(paths.getOutputDir(), outputDir, sectionFn)

      resultFiles[sectionFp] = section
      debug('extracted section %s (pages %d-%d)', sectionId, startPage, endPage)
    } catch (error) {
      throw new PdfGenerationError('pdf-lib', `extract section '${pageId}'`, error.message)
    }
  }

  debug('split complete: %d files', Object.keys(resultFiles).length)
  return resultFiles
}
    