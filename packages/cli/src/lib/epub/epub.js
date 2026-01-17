import { ManifestToEpub } from 'epubjs-cli'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'
import { EpubGenerationError } from '#src/errors/index.js'

/**
 * A façade module for the EPUB.js library
 * @see https://github.com/futurepress/epubjs-cli
 */
export default async (input, output, options = {}) => {
  console.info(`[CLI:lib/epub/epubjs] Generating ePub from ${input}`)

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
    await fs.writeFile(output, file)
  }
}
