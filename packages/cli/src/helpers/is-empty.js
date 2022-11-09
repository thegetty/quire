import fs from 'node:fs'

/**
 * Ignored OS files when determing if a directory _is emtpy_
 */
const ignoreFiles = [
  // MacOS
  '.DS_Store',
  // Windows OS
  'desktop.ini',
  'thumbs.db',
]

/**
 * Test is if a given `path` points to an existing empty directory.
 *
 * @param  {String}  dirpath
 * @return  {Boolean}
 */
export function isEmpty (dirpath) {
  try {
    const files = fs.readdirSync(dirpath)
      .filter((file) => !ignoreFiles.includes(file))
    return !files.length
  } catch (error) {
    console.debug(error)
    return false
  }
}
