const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const pluralize = require('~lib/pluralize')
const yaml = require('js-yaml')

const { error } = chalkFactory('_plugins:globalData')

module.exports = function(eleventyConfig, options) {
  eleventyConfig.addGlobalData('env', process.env)

  const directory = path.join('content', '_data')
  const filenames = fs.readdirSync(directory)

  filenames.forEach((filename) => {
    const { base, ext, name } = path.parse(filename)
    const filepath = path.join(directory, filename)

    /**
     * @typedef {Map<String, Object>} dataExtensions
     * Maps an extension string to an extension properties object
     * @property {String} extension
     * @property {Function} parser
     * @property {Object} options
     */
    const extension = eleventyConfig.dataExtensions[ext]

    try {
      const data = extension.parser(filepath)
      eleventyConfig.addGlobalData(name, data)
    } catch(message) {
      error(`
        Unable to load data from ${filename}\n
        ${message}
      `)
    }
  })
}
