import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade delegation module for EPUB libraries
 */
export default async (lib = 'epubjs', options = {}) => {
  let libName, libPath

  switch (lib.toLowerCase()) {
    case 'epubjs': {
      libName = 'Epub.js'
      libPath = path.join(__dirname, 'epub.js')
      break
    }
    case 'pandoc': {
      libName = 'Pandoc'
      libPath = path.join(__dirname, 'pandoc.js')
      break
    }
    default:
      console.error(`[CLI:lib/pdf] Unrecognized EPUB library '${lib}'`)
      return
  }

  const { default: epubLib } = await dynamicImport(libPath)

  return async (input, output, options = {}) => {
    console.info(`[CLI:lib/epub] generating EPUB using ${libName}`)
    return await epubLib(input, options)
  }
}
