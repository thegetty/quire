const iiifProcess = require('./process')
const iiifPluginConfig = require('./config')

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.on('beforeBuild', () => {
    const config = iiifPluginConfig(eleventyConfig)
    const processImages = iiifProcess.init(config)
    processImages(options.processImages)
  })
  // eleventyConfig.on('afterBuild', () => {})
}
