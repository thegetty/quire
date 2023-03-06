import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade delegation module for PDF generation libraries
 */
export default async (name = 'pagedjs', options = {}) => {
  const lib = { name, options, path }

  const normalizedName = name.replace(/[-_.\s]/g, '').toLowerCase()

  switch (normalizedName) {
    case 'paged':
    case 'pagedjs': {
      lib.name = 'Paged.js'
      lib.options = { debug: options.debug }
      lib.path = path.join(__dirname, 'paged.js')
      break
    }
    case 'prince':
    case 'princexml': {
      lib.name = 'Prince'
      lib.options = { debug: options.debug, verbose: options.verbose }
      lib.path = path.join(__dirname, 'prince.js')
      break
    }
    default:
      console.error(`[CLI:lib/pdf] Unrecognized PDF library '${name}'`)
      return
  }

  const { default: pdfLib } = await dynamicImport(lib.path)

  return async (input, output) => {
    console.info(`[CLI:lib/pdf] generating PDF using ${lib.name}`)
    return await pdfLib(input, output, lib.options)
  }
}
