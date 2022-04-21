const iiifProcess = require('./process')

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.on('eleventy.before', async() => {
    const processImages = iiifProcess.init(eleventyConfig)
    await processImages(options.processImages)
  })
  // eleventyConfig.on('eleventy.after', () => {})
}
