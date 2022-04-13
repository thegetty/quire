const processImages = require('./lib/processImages')
const iiifPluginConfig = require('./config')

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.on('beforeBuild', () => {
    const config = iiifPluginConfig(eleventyConfig)
    processImages(config, options.processImages)
  })
  // eleventyConfig.on('afterBuild', () => {})
}
