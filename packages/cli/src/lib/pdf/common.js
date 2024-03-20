import path from 'node:path'

import { PDFDocument } from 'pdf-lib'
import { paths } from '#lib/11ty/index.js'
  
/**
 * @function splitPdf(file,pageMap) -- sections out individual PDFs from `file` according to `pageMap`
 * 
 * @param {ArrayBuffer} file - PDF file to split
 * @param {Object} pageMap - page map to split PDf by
 * 
 * Creates individual PDFs from by copying `file` (so boxes are already set) and stripping pages out of the range (in reverse order to retain the index sequence)
 * Returns a map of file paths to PDF binary data for serialization
 */

export async function splitPdf(file,coversFile,pageMap,pdfConfig) {

  const pdfDoc = await PDFDocument.load(file)
  const coversDoc = await PDFDocument.load(coversFile)

  let files = {}

  for ( const [pageId, pageConfig] of Object.entries(pageMap) ) {
    const { endPage, startPage, coverPage } = pageConfig

    // FIXME: Set the PDF's sectional doc metadata
    
    const sectionDoc = await pdfDoc.copy()

    for (var p=pdfDoc.getPageCount()-1;p>endPage;p--) {
      sectionDoc.removePage(p)
    }
    for (var q=startPage-1;q>=0;q--) {
      sectionDoc.removePage(q)
    }

    if (coverPage >= 0) {
      // NB: `copyPages()` sets page sizing + other metadata on the way into the target PDF
      const cover = await sectionDoc.copyPages(coversDoc,[coverPage])
      sectionDoc.insertPage(0,cover[0])
    }

    const section = await sectionDoc.save()

    const sectionId = pageId.replace(/^page-/g,'')
    const sectionFn = `${pdfConfig.filename}-${sectionId}.pdf`
    const sectionFp = path.join( paths.output, pdfConfig.outputDir, sectionFn )

    files[sectionFp] = section

  }

  return files

}
    