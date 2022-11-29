import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade delegation module for EPUB libraries
 */
export default async (lib = 'epubjs', options = {}) => {
  let libPath

  switch (lib.toLowerCase()) {
    case 'epubjs': {
      libPath = path.join(__dirname, 'epub.js')
      break
    }
    case 'pandoc': {
      libPath = path.join(__dirname, 'pandoc.js')
      break
    }
    default:
      console.error('[CLI:lib/epub] Unrecognized EPUB library ${lib}')
      return
  }

  const { default: epubLib } = await dynamicImport(libPath)

  return async (input, output, options = {}) => {
    console.info(`[CLI:lib/epub] generating EPUB using ${lib}`)
    return await epubLib(input, options)
  }
}
