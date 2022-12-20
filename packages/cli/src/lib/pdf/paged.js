import Printer from 'pagedjs-cli'
import fs from 'fs-extra'

/**
 * A façade module for interacting with Paged.js
 * @see https://gitlab.coko.foundation/pagedjs/
 */
export default async (input, output, options = {}) => {
  /**
   * Configure the Paged.js Printer options
   * @see https://gitlab.coko.foundation/pagedjs/pagedjs-cli/-/blob/main/src/cli.js
   */
  const printerOptions = {
    allowLocal: true,
    debug: options.debug || false,
    enableWarnings: options.debug || false,
  }

  if (options.debug) {
    const optionsOutput = JSON.stringify(printerOptions, null, 2)
    console.debug(`[CLI:lib/pdf/pagedjs] Printer options\n${optionsOutput}`)
  }

  const printer = new Printer(printerOptions)

  printer.on('page', (page) => {
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

    printer.close()

    if (file && output) {
      await fs.promises.writeFile(output, file)
        .catch((error) => console.error(error))
    }
  } catch (ERR_FILE_NOT_FOUND) {
    console.error(`[CLI:lib/pdf/pagedjs] file not found ${input}`)
  }
}
