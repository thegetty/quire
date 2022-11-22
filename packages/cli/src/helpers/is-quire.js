import fs from 'node:fs'

const QUIRE_DOT_FILES = Object.freeze([
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
export function isQuire (dirpath) {
  return fs.readdirSync(dirpath)
    .includes((file) => QUIRE_DOT_FILES.includes(file))
}

