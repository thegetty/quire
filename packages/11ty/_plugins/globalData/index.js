const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')

const { error, info, warn } = chalkFactory('_plugins:globalData')

module.exports = async function(eleventyConfig, options) {
  // eleventyConfig.addGlobalData('env', process.env)

  const data = (file) => {
    const { base, ext, name } = path.parse(file)
    const fileExt = ext.slice(1)
    const filePath = path.join(directory, file)
    /**
     * @typedef {Map<String, Object>} dataExtensions
     * Maps an extension string to an extension properties object
     * @property {String} extension
     * @property {Function} parser
     * @property {Object} options
     */
    const extension = eleventyConfig.dataExtensions.get(fileExt)

    return extension.parser(fs.readFileSync(filePath))
  }

  const directory = path.join('content', '_data')
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const { name: key } = path.parse(file)
    eleventyConfig.addGlobalData(key, data(file))
  }
}
