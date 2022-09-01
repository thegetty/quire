const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')

const { error, info, warn } = chalkFactory('_plugins:globalData')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addGlobalData('env', process.env)

  const directory = path.join('content', '_data')
  const files = fs.readdirSync(directory)

  files.forEach(async (file) => {
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

    try {
      const data = await extension.parser(fs.readFileSync(filePath))
      eleventyConfig.addGlobalData(name, data)
    } catch(message) {
      error(`
        Unable to load data from ${fileName}\n
        ${message}
      `)
    }
  })
}
