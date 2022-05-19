const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

module.exports = function(eleventyConfig, options) {
  const dataDirectory = path.join('content', '_data')
  const filenames = fs.readdirSync(dataDirectory)
  filenames.forEach((item) => {
    const { base, ext, name } = path.parse(item)
    const filePath = path.join(dataDirectory, item)

    let data;
    switch(ext) {
      case '.geojson':
      case '.json':
        data = fs.readJsonSync(filePath)
        break;
      case '.yaml':
      case '.yml':
        data = yaml.load(fs.readFileSync(filePath))
        break;
      default:
        return;
    }
    eleventyConfig.addGlobalData(name, data)
  })
}
