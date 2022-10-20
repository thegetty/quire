const fs = require('fs-extra')
const manifestFactory = require('./manifest.js')
const path = require('path')
const sass = require('sass')
const transform = require('./transform.js')
const write = require('./write.js')

module.exports = (eleventyConfig, collections) => {
  const assetsDir = '_assets'

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

    /**
     * Copy fonts
     */
    const fontsSrcDir = path.join(eleventyConfig.dir.input, assetsDir, 'fonts')
    const fontsDestDir = path.join(outputDir, assetsDir, 'fonts')
    fs.copySync(fontsSrcDir, fontsDestDir)

    /**
     * Copy Styles
     */
      const sassOptions = {
        loadPaths: [
          path.resolve('node_modules')
        ]
      }
     const styles = sass.compile(path.resolve('content', assetsDir, 'styles', 'epub.scss'), sassOptions)
     write(path.join(outputDir, assetsDir, 'epub.css'), styles.css)

    /**
     * Copy assets
     */
    const { assets } = eleventyConfig.globalData.epub
    for (const asset of assets) {
      fs.copySync(path.join(eleventyConfig.dir.output, asset), path.join(outputDir, asset))
    }
  })
}
