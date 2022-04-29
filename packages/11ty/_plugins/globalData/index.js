const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

module.exports = function(eleventyConfig, options) {
  const dataDirectory = path.join('content', '_data')
  const filenames = fs.readdirSync(dataDirectory)
  filenames.forEach((item) => {
    const { base, ext, name } = path.parse(item)
    if (!['.yaml', '.yml'].includes(ext)) return;
    const data = yaml.load(fs.readFileSync(path.join(dataDirectory, item)))
    eleventyConfig.addGlobalData(name, data)
  })
}
