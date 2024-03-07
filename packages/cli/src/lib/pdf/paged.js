import Printer from 'pagedjs-cli'
import { projectRoot  } from '#lib/11ty/index.js'

import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './common.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade module for interacting with Paged.js and pagedjs-cli  
 * @see https://gitlab.coko.foundation/pagedjs/
 */
export default async (input, output, options = {}) => {
  /**
   * Configure the Paged.js Printer options
   * @see https://gitlab.coko.foundation/pagedjs/pagedjs-cli/-/blob/main/src/cli.js
   */

  let additionalScripts = []

  if (options.pagePdfs) {
    additionalScripts.push( path.join(__dirname, 'pagedPlugin.js') )
  }

  if (options.websafe) {
    // FIXME: .. add styles or...
    // FIXME: additionaScripts.push( path.join(__dirname, 'websafeImages.js')) 
  }

  if (options.withCropsBleeds) {
    // FIXME: .. add styles or..
    // FIXME: additionalScripts.push( path.join(__dirname, 'cropsBleedsRemove.js')) 
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

  const printer = new Printer(printerOptions)

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
    console.info(`[CLI:lib/pdf/pagedjs] printing ${input}`)

    const file = await printer.pdf(input, pdfOptions)
      .catch((error) => console.error(error))

    let pageMap

    // Now it's printed, create the pageMap by running JS in the printer's context
    const pages = await printer.browser.pages()
    if (pages.length > 0) {
      pageMap = await pages[pages.length - 1].evaluate(() => {
        // Retrieves the pageMap from our plugin
        return window.pageMap ?? {}
      })

    }

    if (file && output) {

      const { dir } = path.parse(output)
      if (!fs.existsSync(dir)) { 
        fs.mkdirsSync(dir)
      }

      await fs.promises.writeFile(output, file)
        .catch((error) => console.error(error))
      splitPdf(file,pageMap,options.pdfConfig)

    }

    // Leave the printer open for debug logs
    if (!options.debug) {
      printer.close()    
    }

  } catch (ERR_FILE_NOT_FOUND) {
    console.error(`[CLI:lib/pdf/pagedjs] file not found ${input}`)
  }
}
