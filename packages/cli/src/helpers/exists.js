/**
 * A helper module to test if a path exists
 * @module exists
 */
import fs from 'node:fs'

/**
 * Test is if a given `path` points to an existing file or directory.
 * 
 * @param  {String}  filepath
 * @return  {Boolean}
 */
export function exists (filepath) {
  return fs.existsSync(filepath)
}