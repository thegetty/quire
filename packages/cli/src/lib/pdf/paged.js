import Printer from 'pagedjs-cli'

import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './split.js'
import { PdfGenerationError } from '#src/errors/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
   */
  const pdfOptions = {
    outlineTags: options.outlineTags || ['h1'],
  }

  if (options.debug) {
    const optionsOutput = JSON.stringify(pdfOptions, null, 2)
    console.debug(`[CLI:lib/pdf/pagedjs] PDF options\n${optionsOutput}`)
  }

  console.info(`[CLI:lib/pdf/pagedjs] printing ${publicationInput}`)

  let file
  try {
    file = await printer.pdf(publicationInput, pdfOptions)
  } catch (error) {
    throw new PdfGenerationError('Paged.js', 'PDF rendering', error.message)
  }

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

    try {
      coversFile = await coverPrinter.pdf(coversInput, pdfOptions)
    } catch (error) {
      throw new PdfGenerationError('Paged.js', 'cover PDF rendering', error.message)
    }

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

    const files = await splitPdf(file,coversFile,pageMap,options.pdfConfig)

    await Promise.all(
      Object.entries(files).map(([filePath, pagePdf]) =>
        fs.promises.writeFile(filePath, pagePdf)
      )
    )
  }
}
