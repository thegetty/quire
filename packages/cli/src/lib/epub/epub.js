import { ManifestToEpub } from 'epubjs-cli'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'
import { EpubGenerationError } from '#src/errors/index.js'
import createDebug from '#debug'
import ENGINES from './engines.js'

const debug = createDebug('lib:epub:epubjs')

/** Re-export engine metadata from central registry */
export const metadata = ENGINES.epubjs

/**
 * A façade module for the EPUB.js library
 * @see https://github.com/futurepress/epubjs-cli
 *
 * @param {string} input - Path to the input directory containing manifest.json
 * @param {string} output - Path where the EPUB should be written
 * @param {Object} [options={}] - Generation options
 * @returns {Promise<void>}
 */
export default async (input, output, options = {}) => {
  debug('input: %s', input)
  debug('output: %s', output)

  const url = pathToFileURL(`${input}/manifest.json`).toString()

  let epub
  try {
    epub = await new ManifestToEpub(url)
  } catch (error) {
    throw new EpubGenerationError('Epub.js', 'manifest loading', error.message)
  }

  let file
  try {
    file = await epub.save()
  } catch (error) {
    throw new EpubGenerationError('Epub.js', 'file generation', error.message)
  }

  if (file && output) {
    debug('writing EPUB to %s', output)
    try {
      await fs.writeFile(output, file)
    } catch (error) {
      throw new EpubGenerationError('Epub.js', 'file write', error.message)
    }
  }

  debug('complete')
}
