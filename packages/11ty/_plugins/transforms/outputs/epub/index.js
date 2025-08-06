import fs from 'fs-extra'
import manifestFactory from './manifest.js'
import path from 'node:path'
import * as sass from 'sass'
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
    const { pathname } = eleventyConfig.globalData.publication
    const { url: coverUrl } = manifest.resources.find(({ rel }) => rel === 'cover-image')
    assets.push(coverUrl)

    const pathStem = pathname.replace(/^\//, '')
    const assetStem = path.join(pathStem, '_assets')

    const isUrl = /https?:\/\//
    // Because epub runs simultaneously to the vite transform (!!) do path math to understand asset locations
    for (let asset of assets) {
      let assetDir
      // TODO: `destPath` needs to create a filename for `asset`
      const destPath = path.join(outputDir, asset)

      // Fetch assets from content/_assets, otherwise use public or _site
      switch (true) {
        case isUrl.test(asset):
          continue
        case pathStem !== '' &&
              asset.startsWith(assetStem):

          assetDir = eleventyConfig.directoryAssignments.input
          asset = asset.replace(pathStem, '')
          break
        case asset.split(path.sep).at(0) === '_assets':
          assetDir = eleventyConfig.directoryAssignments.input
          break
        case pathStem !== '' &&
          eleventyConfig.globalData.directoryConfig.publicDir !== false:

          asset = asset.replace(pathStem, '')
          assetDir = eleventyConfig.globalData.directoryConfig.publicDir
          break

        case eleventyConfig.globalData.directoryConfig.publicDir !== false:
          assetDir = eleventyConfig.globalData.directoryConfig.publicDir
          break
        default:
          assetDir = eleventyConfig.directoryAssignments.output
      }

      const srcPath = path.join(assetDir, asset)

      try {
        fs.copySync(srcPath, destPath)
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    }
  })
}
