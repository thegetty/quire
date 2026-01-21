import Printer from 'pagedjs-cli'

import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import processManager from '#lib/process/manager.js'
import reporter from '#lib/reporter/index.js'
import { splitPdf } from './split.js'
import { PdfGenerationError } from '#src/errors/index.js'
import createDebug from '#debug'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:pdf:paged')

/**
 * A façade module for interacting with Paged.js and pagedjs-cli
 * @see https://gitlab.coko.foundation/pagedjs/
 *
 * @param {string} publicationInput - Path to the publication HTML file
 * @param {string} coversInput - Path to the covers HTML file
 * @param {string} pdfPath - Path where the PDF should be written
 * @param {Object} [options={}] - Generation options
 * @returns {Promise<string>} Path to the generated PDF file
 */
export default async (publicationInput, coversInput, pdfPath, options = {}) => {
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

  // Register cleanup handler for graceful shutdown
  processManager.onShutdown('pagedjs', () => {
    debug('closing printer')
    printer.close()
  })

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
   */
  const pdfOptions = {
    outlineTags: options.outlineTags || ['h1'],
  }

  debug('pdf options: %O', pdfOptions)

  debug('printing %s', publicationInput)
  reporter.update('Rendering PDF...')

  let file
  try {
    file = await printer.pdf(publicationInput, pdfOptions)
  } catch (error) {
    throw new PdfGenerationError('Paged.js', 'PDF rendering', error.message)
  }

  let pageMap

  // Now it's printed, create the pageMap by running JS in the printer's context
  let coversFile

  debug('generating page map')
  reporter.update('Generating page map...')
  try {
    const pages = await printer.browser.pages()

    if (pages.length > 0) {
      pageMap = await pages[pages.length - 1].evaluate(() => {
        // Retrieves the pageMap from our plugin
        return window.pageMap ?? {} // eslint-disable-line no-undef
      })
    }
  } catch (error) {
    throw new PdfGenerationError('Paged.js', 'page map extraction', error.message)
  }

  if ( pdfConfig?.pagePDF?.coverPage===true && fs.existsSync(coversInput) ) {
    debug('printing covers %s', coversInput)
    reporter.update('Rendering cover pages...')

    const coverPrinter = new Printer(printerOptions)

    try {
      coversFile = await coverPrinter.pdf(coversInput, pdfOptions)
    } catch (error) {
      coverPrinter.close()
      throw new PdfGenerationError('Paged.js', 'cover PDF rendering', error.message)
    }

    try {
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
    } catch (error) {
      coverPrinter.close()
      throw new PdfGenerationError('Paged.js', 'cover page map extraction', error.message)
    }

    coverPrinter.close()
  }

  // Leave the printer open for debug logs
  if (!options.debug) {
    printer.close()
  }

  // Unregister cleanup handler
  processManager.onShutdownComplete('pagedjs')

  if (file && pdfPath) {
    debug('writing files')
    reporter.update('Writing PDF files...')

    try {
      const { dir } = path.parse(pdfPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirsSync(dir)
      }

      await fs.promises.writeFile(pdfPath, file)
    } catch (error) {
      throw new PdfGenerationError('Paged.js', 'PDF file write', error.message)
    }

    try {
      const files = await splitPdf(file, coversFile, pageMap, options.pdfConfig)

      await Promise.all(
        Object.entries(files).map(([filePath, pagePdf]) =>
          fs.promises.writeFile(filePath, pagePdf)
        )
      )
    } catch (error) {
      throw new PdfGenerationError('Paged.js', 'PDF splitting', error.message)
    }
  }

  return pdfPath
}
