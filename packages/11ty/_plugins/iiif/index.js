const iiifProcess = require('./process')
const iiifPluginConfig = require('./config')

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.on('eleventy.before', async() => {
    const config = iiifPluginConfig(eleventyConfig)
    const processImages = iiifProcess.init(config)
    await processImages(options.processImages)
  })
  // eleventyConfig.on('eleventy.after', () => {})
}
