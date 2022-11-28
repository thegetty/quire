import Printer from 'pagedjs-cli'

/**
 * A façade module for interacting with Paged.js
 * @see https://gitlab.coko.foundation/pagedjs/
 */
export default async (input, options) => {
  /**
   * Configure the Paged.js Printer options
   * @see https://gitlab.coko.foundation/pagedjs/pagedjs-cli/-/blob/main/src/cli.js
   */
  const printerOptions = { debug: options.debug || false }

  const printer = new Printer(printerOptions)

  /**
   * Configure the Paged.js PDF options
   * @see
   */
  const pdfOptions = {}

  try {
    return await printer.pdf(input, pdfOptions)
  } catch (ERR_FILE_NOT_FOUND) {
    console.error(`[CLI:lib/pdf] input file ${input} could not be found`)
  }
}
