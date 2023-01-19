import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade delegation module for EPUB libraries
 */
export default async (name = 'epubjs', options = {}) => {
  const lib = { name, options, path }

  switch (lib.toLowerCase()) {
    case 'epubjs': {
      lib.name = 'Epub.js'
      lib.options = {}
      lib.path = path.join(__dirname, 'epub.js')
      break
    }
    case 'pandoc': {
      lib.name = 'Pandoc'
      lib.options = {}
      lib.path = path.join(__dirname, 'pandoc.js')
      break
    }
    default:
      console.error(`[CLI:lib/pdf] Unrecognized EPUB library '${name}'`)
      return
  }

  const { default: epubLib } = await dynamicImport(lib.path)

  return async (input, output) => {
    console.info(`[CLI:lib/epub] generating EPUB using ${lib.name}`)
    return await epubLib(input, output, lib.options)
  }
}
