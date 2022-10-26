import fs from 'node:fs'

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
    return !files.length
  } catch (error) {
    console.debug(error)
    return false
  }
}
