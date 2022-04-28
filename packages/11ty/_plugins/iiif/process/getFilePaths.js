const fs = require('fs-extra')
const path = require('path')
/**
 * Returns a list of paths to supported image files in a directory
 * @param  {String} directory
 * @param  {Object} config
 * @property {Array} exts Array of extensions that returned files must match
 * @return {Array<String>} List of image file paths           
 */
const getFilePaths = (directory, config={}) => {
  const { exts } = config
  const filenames = fs.readdirSync(directory)

  return filenames.flatMap((filename) => {
    const filePath = path.join(directory, filename)
    const { ext } = path.parse(filename)
    switch (true) {
      case !!exts:
        if (exts.includes(ext)) {
          return filePath
        }
        break
      default:
        break
    }
  }).filter(item => item)
}

module.exports = getFilePaths
