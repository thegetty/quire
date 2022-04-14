/**
 * Get last directory name from file path
 * Used as Unique ID in IIIF processing
 * @return {String} file path
 */
const path = require('path')

module.exports = (filePath) => {
  const { dir } = path.parse(filePath)
  const dirParts = dir.split(path.sep)
  return dirParts[dirParts.length - 1]
}
