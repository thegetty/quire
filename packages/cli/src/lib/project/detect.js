/**
 * Project detection module
 *
 * Detects if a directory is a Quire project root by checking for marker files.
 *
 * @module lib/project/detect
 */
import fs from 'node:fs'

/**
 * Files that indicate a Quire project directory.
 *
 * These marker files are created by `quire new` or exist in Quire project templates.
 * The presence of any one of these files indicates the directory is a Quire project root.
 *
 * @constant {ReadonlyArray<string>}
 *
 * @example
 * // Check if a file is a project marker
 * if (PROJECT_MARKERS.includes(filename)) {
 *   console.log('This is a Quire project root')
 * }
 */
export const PROJECT_MARKERS = Object.freeze([
  '.eleventy.js',
  '.quire',
  '.quire-11ty',
  '.quire-version',
  'eleventy.config.js',
])

/**
 * Test if a directory is a Quire project root
 *
 * Nota bene: `dirpath` must be to the Quire project root to positively confirm
 * a directory is a Quire project, testing a Quire project subdirectory will
 * return falsely negative result.
 *
 * @todo refactor this to throw an Error NOTQUIRE
 *
 * @param    {String}   dirpath   path to a local directory
 * @return   {Promise}
 */
export default function (dirpath) {
  return fs.readdirSync(dirpath)
    .find((entry) => PROJECT_MARKERS.includes(entry))
}
