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
  const printerOptions = {
    allowLocal: true,
    debug: options.debug || false,
  }

  const printer = new Printer(printerOptions)

  /**
   * Configure the Paged.js PDF options
   * @see
   */
  const pdfOptions = {
    outlineTags: options.outlineTags || 'h1',
  }

  try {
    console.info(`[CLI:lib/pdf/pagedjs] printing ${input}`)
    const file = await printer.pdf(input, pdfOptions)
    // @todo write file
  } catch (ERR_FILE_NOT_FOUND) {
    console.error(`[CLI:lib/pdf/pagedjs] file not found ${input}`)
  }
}
