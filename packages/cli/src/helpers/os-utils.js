import { pathToFileURL } from 'node:url'

/**
 * Determine if the process is running on Windows operating system
 */
export const IS_WINDOWS =
  process.platform === 'win32' || /^(cygwin|msys)$/.test(process.env.OSTYPE)

/**
 * Cross platform dynamic module import
 * On the Windows platform ESM modules are loaded using the file:// scheme.
 *
 * Nota bene: a relative `path` argument is relative to this module!
 *
 *
 * @param      {String}  path    An aboslute path for the module to import
 * @return     {Object}  Imported module
 */
export const dynamicImport = async (path) => {
  try {
    return IS_WINDOWS ? await import(pathToFileURL(path)) : await import(path)
  } catch (error) {
    console.error(`[CLI] unable to import ${path}`, error)
  }
}
