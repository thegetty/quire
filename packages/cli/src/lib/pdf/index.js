import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade delegation module for PDF generation libraries
 */
export default async (lib = 'pagedjs', options = {}) => {
  let libPath

  switch (lib.toLowerCase()) {
    case 'paged':
    case 'pagedjs': {
      libPath = path.join(__dirname, 'paged.js')
      break
    }
    case 'prince':
    case 'princexml': {
      libPath = path.join(__dirname, 'prince.js')
      break
    }
    default:
      console.error('[CLI:lib/pdf] Unrecognized PDF library ${lib}')
      return
  }

  const { default: pdfLib } = await dynamicImport(libPath)

  return async (input, output, options = {}) => {
    console.info(`[CLI:lib/pdf] generating PDF using ${lib}`)
    return await pdfLib(input, output, options)
  }
}
