import { ManifestToEpub } from 'epubjs-cli'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'
import { logger } from '#lib/logger/index.js'
import createDebug from '#debug'

const debug = createDebug('lib:epub:epubjs')

/**
 * A façade module for the EPUB.js library
 * @see https://github.com/futurepress/epubjs-cli
 */
export default async (input, output, options = {}) => {
  try {
    debug('generating ePub from %s', input)

    const url = pathToFileURL(`${input}/manifest.json`).toString()

    const epub = await new ManifestToEpub(url)
      .catch((error) => logger.error(error.message))

    const file = await epub.save()
      .catch((error) => logger.error(error.message))

    if (file && output) {
      debug('writing ePub to %s', output)
      fs.writeFile(output, file, (error) => { if (error) throw error })
      logger.info(`EPUB saved to ${output}`)
    }
  } catch (ERR_FILE_NOT_FOUND) {
    logger.error(`File not found: ${input}`)
  }
}
