import { PDFDocument } from 'pdf-lib'
import { paths, projectRoot  } from '#lib/11ty/index.js'
import fs from 'fs-extra'
  
import path from 'node:path'

/**
 * @function splitPdf(file,pageMap) -- sections out individual PDFs from `file` according to `pageMap`
 * 
 * @param {ArrayBuffer} file - PDF file to split
 * @param {Object} pageMap - page map to split PDf by
 * 
 * Creates individual PDFs from by copying `file` (so boxes are already set) and stripping pages out of the range (in reverse order to retain the index sequence)
 * FIXME: Should return a tupe of array of `file Array<Serializable>` for serialization 
 * FIXME: Needs to take a printer arg so we can print more cover pages? Or return the data / html for the covers and let our caller do it
 */

export async function splitPdf(file,coversFile,pageMap,pdfConfig) {

  const pdfDoc = await PDFDocument.load(file)
  const coversDoc = await PDFDocument.load(coversFile)

  for ( const [pageId, pageConfig] of Object.entries(pageMap) ) {
    const { endPage, startPage, coverPage } = pageConfig

    // FIXME: Set the PDF's sectional doc metadata
    
    const sectionDoc = await pdfDoc.copy()

    for (var p=pdfDoc.getPageCount()-1;p>endPage;p--) {
      sectionDoc.removePage(p)
    }
    for (var p=startPage-1;p>=0;p--) {
      sectionDoc.removePage(p)
    }

    if (coverPage >= 0) {
      // NB: `copyPages()` sets page sizing + other metadata 
      const cover = await sectionDoc.copyPages(coversDoc,[coverPage])
      sectionDoc.insertPage(0,cover[0])
    }

    const section = await sectionDoc.save()

    const sectionId = pageId.replace(/^page-/g,"")
    const sectionFn = `${pdfConfig.filename}-${sectionId}.pdf`
    const sectionFp = path.join( paths.output, pdfConfig.outputDir, sectionFn )

    await fs.promises.writeFile(sectionFp,section)
            .catch((error) => console.error(error))
  }

}
    