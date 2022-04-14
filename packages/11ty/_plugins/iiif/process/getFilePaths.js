const fs = require('fs-extra')
const path = require('path')
/**
 * Returns a filtered list of the paths to supported image files in a directory
 * @param  {String} directory
 * @param  {Object} config
 * @property {Array} exts Array of extensions that returned files must match
 * @property {Array} names Array of names that returned files must match
 * @return {Array<String>} List of image file paths           
 */
const getFilePaths = (directory, config={}) => {
  const { exts, names } = config
  const filenames = fs.readdirSync(directory)

  return filenames.flatMap((filename) => {
    const filePath = path.join(directory, filename)
    const { ext, name } = path.parse(filename)
    if (fs.lstatSync(filePath).isDirectory()) {
      return getFilePaths(filePath, config)
    }
    switch (true) {
      case !!exts:
        if (exts.includes(ext)) {
          return filePath
        }
        break
      case !!names:
        if (names.includes(name)) {
          return filePath
        }
        break
      default:
        break
    }
  }).filter(item => item)
}

module.exports = getFilePaths
