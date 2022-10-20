const fs = require('fs-extra')
const path = require('path')
const transform = require('./transform.js')
const manifestFactory = require('./manifest.js')
const write = require('./write.js')

module.exports = (eleventyConfig, collections) => {
  /**
   * Create "epub" global data property
   */
  eleventyConfig.addGlobalData('epub', { assets: [], readingOrder: [] })
  /**
   * Write sequenced files to `epub` directory during transform
   */
  eleventyConfig.addTransform('epub', function (content) {
    return transform.call(this, eleventyConfig, collections, content)
  })
  /**
   * Write publication JSON and copy assets
   */
  eleventyConfig.on('eleventy.after', () => {
    const { outputDir } = eleventyConfig.globalData.config.epub
    const manifest = manifestFactory(eleventyConfig)
    write(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest))
    const { assets } = eleventyConfig.globalData.epub
    for (const asset of assets) {
      fs.copySync(path.join('_site', asset), path.join(outputDir, asset))
    }
  })
}
