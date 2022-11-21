import Printer from 'pagedjs-cli'

/**
 * A façade module for interacting with Paged.js
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

  return await printer.pdf(input, pdfOptions)
}
