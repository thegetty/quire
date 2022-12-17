import { ManifestToEpub } from 'epubjs-cli'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'

/**
 * A façade module for the EPUB.js library
 * @see https://github.com/futurepress/epubjs-cli
 */
export default async (input, output, options) => {
  try {
    console.info(`[CLI:lib/epub/epubjs] Generating ePub from ${input}`)

    const url = pathToFileURL(`${input}/manifest.json`).toString()

    const epub = await new ManifestToEpub(url)
      .catch((error) => console.error(error))

    const file = await epub.save()
      .catch((error) => console.error(error))

    if (file && output) {
      fs.writeFile(output, file, (error) => { if (error) throw error })
    }
  } catch (ERR_FILE_NOT_FOUND) {
    console.error(`[CLI:lib/epub/epubjs] file not found ${input}`)
  }
}
