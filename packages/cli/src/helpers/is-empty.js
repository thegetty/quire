import fs from 'node:fs'

/**
 * Test is if a given `path` points to an existing empty directory.
 *
 * @todo refactor to ignore macOS `.DS_Store` files.
 *
 * @param  {String}  dirpath
 * @return  {Boolean}
 */
export async function isEmpty (dirpath) {
  try {
    const directory = await fs.opendir(dirpath)
    const entry = directory.read()
    await directory.close()
    return entry === null
  } catch (error) {
    console.debug(error)
    return false
  }
}
