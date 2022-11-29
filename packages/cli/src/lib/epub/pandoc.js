import { execa } from 'execa'
import path from 'node:path'
import paths, { projectRoot } from '#lib/11ty/paths.js'
import which from '#helpers/which.js'

/**
 * A façade module for interacting with Pandoc CLI.
 * @see https://pandoc.org/MANUAL.html#general-options
 */
export default async (input, options) => {
  which('pandoc')

  const inputDir = path.join(projectRoot, paths.epub)

  const defaults = [
    `--from=html-native_divs+native_spans`,
    `--to=epub ${path.join(inputDir, 'epub.xhtml')}`,
    `--output=${path.join(projectRoot, `pandoc.epub`)}`,
    // `--epub-metadata=${path.join(inputDir, 'dc.xml')}`,
    // `--epub-cover-image=${coverImage}`,
    // `--template=${path.join(inputDir, 'template.xhtml')}`,
    `--css=${path.join(inputDir, '_assets', 'epub.css')}`,
    `--standalone`
  ]

  const cmdOptions = Object.assign(defaults, options)
  const { stderror, stdout } = execa('pandoc', cmdOptions)
  return { stderror, stdout }
}
