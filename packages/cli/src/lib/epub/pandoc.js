import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'node:path'
import { EpubGenerationError } from '#src/errors/index.js'
import createDebug from '#debug'
import ENGINES from './engines.js'

const debug = createDebug('lib:epub:pandoc')

/** Re-export engine metadata from central registry */
export const metadata = ENGINES.pandoc

/**
 * Filter directory entries for XHTML files
 *
 * @param    {fs.Dirent}  dirent  directory entry
 * @return   {fs.Dirent}  XHTML entries
 */
const xhtmlFiles = (dirent) => {
  const stats = fs.lstatSync(dirent)
  const { ext } = path.parse(dirent)
  return stats.isFile() && ext === '.xhtml'
}

/**
 * A façade module for interacting with Pandoc CLI.
 * @see https://pandoc.org/MANUAL.html#general-options
 *
 * Pandoc availability is checked by the parent façade (lib/epub/index.js)
 * before this module is loaded, so we can assume pandoc is in PATH.
 *
 * @param {string} input - Path to the input directory containing XHTML files
 * @param {string} output - Path where the EPUB should be written
 * @param {Object} [options={}] - Generation options
 * @returns {Promise<void>}
 */
export default async (input, output, options = {}) => {
  debug('input: %s', input)
  debug('output: %s', output)

  const inputs = fs.readdirSync(input)
    .map((entry) => path.join(input, entry))
    .filter(xhtmlFiles)

  const cmdOptions = [
    `--from=html-native_divs+native_spans`,
    `--to=epub`,
    `--output=${output}`,
    // `--epub-metadata=${path.join(input, 'dc.xml')}`,
    // `--epub-cover-image=${coverImage}`,
    // `--template=${path.join(input, 'template.xhtml')}`,
    `--css=${path.join(input, '_assets', 'epub.css')}`,
    `--standalone`,
  ]

  debug('cmd options: %O', cmdOptions)
  debug('inputs: %d XHTML files', inputs.length)

  try {
    await execa('pandoc', [...cmdOptions, ...inputs])
  } catch (error) {
    throw new EpubGenerationError('Pandoc', 'EPUB generation', error.stderr || error.message)
  }

  debug('complete')
}
