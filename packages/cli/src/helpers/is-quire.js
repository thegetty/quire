import fs from 'node:fs'
import path from 'node:path'

/**
 * Test if a directory is a Quire project root
 *
 * Nota bene: `dirpath` must be to the Quire project root to positively confirm
 * a directory is a Quire project, testing a Quire project subdirectory will
 * return falsely negative result.
 *
 * @param    {String}   dirpath   path to a local directory
 * @return   {Promise}
 */
export function isQuire (dirpath) {
  return fs.readdirSync(dirpath)
    .includes((file) => file === '.eleventy.js' || file === '.quire.js')
}

