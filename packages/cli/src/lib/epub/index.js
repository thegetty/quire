import { dynamicImport } from '#helpers/os-utils.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { InvalidEpubLibraryError } from '#src/errors/index.js'
import { logger } from '#lib/logger/index.js'
import createDebug from '#debug'
import { ENGINES } from './schema.js'

export { ENGINES }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:epub')

/**
 * A façade delegation module for EPUB libraries
 */
export default async (name = 'epubjs', options = {}) => {
  const lib = { name, options, path }

  const normalizedName = name.replace(/[-_.\s]/g, '').toLowerCase()

  switch (normalizedName) {
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
      throw new InvalidEpubLibraryError(name)
  }

  const { default: epubLib } = await dynamicImport(lib.path)

  debug('resolved library: %s → %s', name, lib.name)

  return async (input, output) => {
    logger.info(`Generating EPUB using ${lib.name}...`)
    debug('input: %s, output: %s', input, output)
    return await epubLib(input, output, lib.options)
  }
}
