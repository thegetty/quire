import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'node:path'
import paths, { projectRoot } from '#lib/11ty/paths.js'
import which from '#helpers/which.js'

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
 */
export default async (input, output, options) => {
  which('pandoc')

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

  await execa('pandoc', [...cmdOptions, ...inputs])
}
