import fs from 'fs-extra'
import manifestFactory from './manifest.js'
import path from 'node:path'
import sass from 'sass'
import transform from './transform.js'
import writer from './writer.js'

export default (eleventyConfig, collections) => {
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
      const source = path.join(eleventyConfig.directoryAssignments.input, assetsDir, name)
      const dest = path.join(outputDir, assetsDir, name)
      fs.copySync(source, dest)
    })

    /**
     * Copy styles
     */
    const sassOptions = {
      api: 'modern-compiler',
      loadPaths: [path.resolve('node_modules')],
      silenceDeprecations: [
        'color-functions',
        'global-builtin',
        'import',
        'legacy-js-api',
        'mixed-decls'
      ]
    }

    const styles = sass.compile(path.resolve(eleventyConfig.directoryAssignments.input, assetsDir, 'styles', 'epub.scss'), sassOptions)
    write(path.join(assetsDir, 'epub.css'), styles.css)

    /**
     * Copy assets
     */

    const { assets } = eleventyConfig.globalData.epub
    const { url: coverUrl } = manifest.resources.find(({ rel }) => rel === 'cover-image')
    assets.push(coverUrl)

    // Because epub runs simultaneously to the vite transform (!!) do path math to understand asset locations
    for (const asset of assets) {
      let assetDir

      switch (true) {
        case asset.startsWith('_assets'):
          assetDir = eleventyConfig.directoryAssignments.input
          break
        case eleventyConfig.globalData.directoryConfig.publicDir !== false:
          assetDir = eleventyConfig.globalData.directoryConfig.publicDir
          break
        default:
          assetDir = eleventyConfig.directoryAssignments.output
      }

      const srcPath = path.join(assetDir, asset)
      console.log(srcPath)
      const destPath = path.join(outputDir, asset)

      fs.copySync(srcPath, destPath)
    }
  })
}
