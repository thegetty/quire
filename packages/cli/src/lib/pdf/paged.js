import Printer from 'pagedjs-cli'

import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './split.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// FIXME: This module swallows errors currently.

/**
 * A façade module for interacting with Paged.js and pagedjs-cli  
 * @see https://gitlab.coko.foundation/pagedjs/
 */
export default async (publicationInput, coversInput, output, options = {}) => {
  /**
   * Configure the Paged.js Printer options
   * @see https://gitlab.coko.foundation/pagedjs/pagedjs-cli/-/blob/main/src/cli.js
   */

  let additionalScripts = []
  
  const { pdfConfig } = options

  if (pdfConfig?.pagePDF?.output === true) {
    additionalScripts.push( path.join(__dirname, 'pagedPlugin.js') )
  }

  const printerOptions = {
    allowLocal: true,
    debug: options.debug || false,
    enableWarnings: options.debug || false,
    closeAfter: false,
    additionalScripts,
  }

  if (options.debug) {
    const optionsOutput = JSON.stringify(printerOptions, null, 2)
    console.debug(`[CLI:lib/pdf/pagedjs] Printer options\n${optionsOutput}`)
  }

  let printer = new Printer(printerOptions)

  printer.on('page', (page,pageElement,breakToken) => {
    if (page.position === 0) {
      console.info(`[CLI:lib/pdf/pagedjs] loaded`)
    } 
  })

  printer.on('rendered', (msg) => {
    console.info(`[CLI:lib/pdf/pagedjs] ${msg}`)
  })

  printer.on('postprocessing', () => {
    console.info(`[CLI:lib/pdf/pagedjs] post-processing`)
  })

  /**
   * Configure the Paged.js PDF options
   * @see
   *
   * @todo verify options before setting them
   * @todo catch errors thrown by the printer
   */
  const pdfOptions = {
    outlineTags: options.outlineTags || ['h1'],
  }

  if (options.debug) {
    const optionsOutput = JSON.stringify(pdfOptions, null, 2)
    console.debug(`[CLI:lib/pdf/pagedjs] PDF options\n${optionsOutput}`)
  }

  try {
    console.info(`[CLI:lib/pdf/pagedjs] printing ${publicationInput}`)

    const file = await printer.pdf(publicationInput, pdfOptions)
      .catch((error) => console.error(error))

    let pageMap

    // Now it's printed, create the pageMap by running JS in the printer's context
    let coversFile

    console.info(`[CLI:lib/pdf/pagedjs] generating page map`)
    const pages = await printer.browser.pages()

    if (pages.length > 0) {
      pageMap = await pages[pages.length - 1].evaluate(() => {
        // Retrieves the pageMap from our plugin
        return window.pageMap ?? {} // eslint-disable-line no-undef
      })
    }

    if ( pdfConfig?.pagePDF?.coverPage===true && fs.existsSync(coversInput) ) {
      console.info(`[CLI:lib/pdf/pagedjs] printing ${coversInput}`)

      const coverPrinter = new Printer(printerOptions)

      coversFile = await coverPrinter.pdf(coversInput, pdfOptions)
        .catch((error) => console.error(error))

      const coverPages = await coverPrinter.browser.pages()

      if (coverPages.length > 0) {
        const coversMap = await coverPages[coverPages.length - 1].evaluate(() => {
          // Retrieves the pageMap from our plugin
          return window.pageMap ?? {} // eslint-disable-line no-undef
        })

        Object.values(coversMap).forEach( cov => {
          if (cov.id in pageMap) {
            pageMap[cov.id].coverPage = cov.startPage           
          }
        })

      }

      coverPrinter.close()
    }      

    // Leave the printer open for debug logs
    if (!options.debug) {
      printer.close()    
    }

    if (file && output) {
      console.info(`[CLI:lib/pdf/pagedjs] writing file(s)`)

      const { dir } = path.parse(output)
      if (!fs.existsSync(dir)) { 
        fs.mkdirsSync(dir)
      }

      await fs.promises.writeFile(output, file)
        .catch((error) => console.error(error))

      const files = await splitPdf(file,coversFile,pageMap,options.pdfConfig)

      Object.entries(files).forEach( async ([filePath,pagePdf]) => {
        await fs.promises.writeFile(filePath,pagePdf)
          .catch((error) => console.error(error))
      })
    }

  } catch (ERR_FILE_NOT_FOUND) {
    console.error(`[CLI:lib/pdf/pagedjs] file not found ${publicationInput}`)
  }
}
