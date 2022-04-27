const iiifProcess = require('./process')
const iiifConfig = require('./config')

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.addGlobalData('iiifConfig', iiifConfig(eleventyConfig))

  eleventyConfig.on('eleventy.before', async() => {
    const processImages = iiifProcess.init(eleventyConfig)
    await processImages(options.processImages)
  })
  // eleventyConfig.on('eleventy.after', () => {})
}
