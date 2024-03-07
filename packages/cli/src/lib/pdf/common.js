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
 * FIXME: Should return an array of `file` for serialization 
 */

export async function splitPdf(file,pageMap,pdfConfig) {

  const pdfDoc = await PDFDocument.load(file)
  for ( const [pageId, pageConfig] of Object.entries(pageMap) ) {
    const { title, endPage, startPage } = pageConfig
    if (title === "") { continue }

    // FIXME: Set the sectional doc metadata
    
    const sectionDoc = await pdfDoc.copy()

    for (var p=pdfDoc.getPageCount()-1;p>endPage;p--) {
      sectionDoc.removePage(p)
    }
    for (var p=startPage-1;p>=0;p--) {
      sectionDoc.removePage(p)
    }

    const section = await sectionDoc.save()

    // FIXME: Generate the coverpage if there is one (erm.. pre-generate the HTML since it needs data templating) and add it
    const sectionId = pageId.replace(/^page-/g,"")
    const sectionFn = `${pdfConfig.filename}-${sectionId}.pdf`
    const sectionFp = path.join( paths.output, pdfConfig.outputDir, sectionFn )

    await fs.promises.writeFile(sectionFp,section)
            .catch((error) => console.error(error))
  }

}
    