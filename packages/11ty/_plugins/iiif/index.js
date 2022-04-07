const processImages = require('./lib/processImages')

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.on('beforeBuild', () => {
    processImages(options.processImages)
  })
  // eleventyConfig.on('afterBuild', () => {})
}
