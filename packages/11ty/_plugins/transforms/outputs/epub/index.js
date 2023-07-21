const fs = require('fs-extra')
const manifestFactory = require('./manifest.js')
const path = require('path')
const sass = require('sass')
const transform = require('./transform.js')
const writer = require('./writer.js')

module.exports = (eleventyConfig, collections) => {
  const { outputDir } = eleventyConfig.globalData.config.epub
  const write = writer(outputDir)

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
    const manifest = manifestFactory(eleventyConfig)
    write('manifest.json', JSON.stringify(manifest))

    /**
     * Copy font and icon directories
     */
    const assetDirsToCopy = ['fonts']

    assetDirsToCopy.forEach((name) => {
      const source = path.join(eleventyConfig.dir.input, assetsDir, name)
      const dest = path.join(outputDir, assetsDir, name)
      fs.copySync(source, dest)
    })

    /**
     * Copy styles
     */
    const sassOptions = {
      loadPaths: [
        path.resolve('node_modules')
      ]
    }
    const styles = sass.compile(path.resolve('content', assetsDir, 'styles', 'epub.scss'), sassOptions)
    write(path.join(assetsDir, 'epub.css'), styles.css)

    /**
     * Copy assets
     */
    const { assets } = eleventyConfig.globalData.epub
    const { url: coverUrl } = manifest.resources.find(({ rel }) => rel === 'cover-image')
    assets.push(coverUrl)
    for (const asset of assets) {
      fs.copySync(
        path.join(eleventyConfig.dir.output, asset),
        path.join(outputDir, asset)
      )
    }
  })
}
