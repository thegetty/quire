import Printer from 'pagedjs-cli'

import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './split.js'
import { logger } from '#lib/logger/index.js'
import createDebug from '#debug'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:pdf:paged')

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

  additionalScripts.push( path.join(__dirname, 'pagedPlugin.js') )

  const printerOptions = {
    allowLocal: true,
    debug: options.debug || false,
    enableWarnings: options.debug || false,
    closeAfter: false,
    additionalScripts,
  }

  debug('printer options: %O', printerOptions)

  let printer = new Printer(printerOptions)

  printer.on('page', (page, pageElement, breakToken) => {
    if (page.position === 0) {
      debug('paged.js loaded')
    }
  })

  printer.on('rendered', (msg) => {
    debug('rendered: %s', msg)
  })

  printer.on('postprocessing', () => {
    debug('post-processing')
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

  debug('pdf options: %O', pdfOptions)

  try {
    debug('printing %s', publicationInput)

    const file = await printer.pdf(publicationInput, pdfOptions)
      .catch((error) => logger.error(error.message))

    let pageMap

    // Now it's printed, create the pageMap by running JS in the printer's context
    let coversFile

    debug('generating page map')
    const pages = await printer.browser.pages()

    if (pages.length > 0) {
      pageMap = await pages[pages.length - 1].evaluate(() => {
        // Retrieves the pageMap from our plugin
        return window.pageMap ?? {} // eslint-disable-line no-undef
      })
    }

    if ( pdfConfig?.pagePDF?.coverPage===true && fs.existsSync(coversInput) ) {
      debug('printing covers %s', coversInput)

      const coverPrinter = new Printer(printerOptions)

      coversFile = await coverPrinter.pdf(coversInput, pdfOptions)
        .catch((error) => logger.error(error.message))

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
      debug('writing files')

      const { dir } = path.parse(output)
      if (!fs.existsSync(dir)) {
        fs.mkdirsSync(dir)
      }

      await fs.promises.writeFile(output, file)
        .catch((error) => logger.error(error.message))

      const files = await splitPdf(file,coversFile,pageMap,options.pdfConfig)

      Object.entries(files).forEach( async ([filePath,pagePdf]) => {
        await fs.promises.writeFile(filePath,pagePdf)
          .catch((error) => logger.error(error.message))
      })
    }

  } catch (error) {
    logger.error(`File not found: ${publicationInput}`)
    debug('error: %O', error)
  }
}
