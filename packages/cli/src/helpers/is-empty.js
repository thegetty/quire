import fs from 'node:fs'
const ignoreFiles = [
  '.DS_Store',
  'thumbs.db',
  'desktop.ini'
]

/**
 * Test is if a given `path` points to an existing empty directory.
 *
 * @todo refactor to ignore macOS `.DS_Store` files.
 *
 * @param  {String}  dirpath
 * @return  {Boolean}
 */
export function isEmpty (dirpath) {
  try {
    const files = fs.readdirSync(dirpath);
    return !files.filter((file) => {
      return !ignoreFiles.includes(file)
    }).length
  } catch (error) {
    console.debug(error)
    return false
  }
}
