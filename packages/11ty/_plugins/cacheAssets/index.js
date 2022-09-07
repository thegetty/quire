const EleventyFetch = require("@11ty/eleventy-fetch");
const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const logger = chalkFactory(`Cache Assets Plugin`)

module.exports = function (eleventyConfig, options = {}) {
  const { outputDir, outputRoot } = eleventyConfig.globalData.iiifConfig
  const assetDir = path.join(outputRoot, outputDir)

  if (!process.env.CACHE_ASSETS) {
    logger.info('Using passthrough copy for IIIF assets')
    eleventyConfig.addPassthroughCopy({ [assetDir]: outputDir })
    return
  }

  const imageHost = process.env.IMAGE_HOST
  const exts = ['.png', '.jpg', '.json']

  const filesToCache = (assetDir) => {
    let filePaths = []
    const getFilesRecursive = (dir) => {
      fs.readdirSync(dir).forEach(child => {
        const filePath = path.join(dir, child)
        const pathStat = fs.lstatSync(filePath)
        if (pathStat.isDirectory()) {
          getFilesRecursive(filePath)
        } else if (exts.includes(path.parse(filePath).ext)) {
          filePaths.push(filePath)
        }
      })
    }
    getFilesRecursive(assetDir)
    return filePaths
  }

  const cache = async (filePath) => {
    const { ext } = path.parse(filePath)
    const [root, relativePath] = filePath.split(outputRoot)
    const url = new URL(relativePath, imageHost).href
    const type = ext === '.json' ? 'json' : 'buffer'
    try {
      const response = await EleventyFetch(url, {
        duration: '*', // set cache to never expire
        type
      })
      if (type === 'json') {
        return response
      }
      const { data, info } = await sharp(response).toBuffer({ resolveWithObject: true })
      return data
    } catch (err) {
      logger.error(err)
    }
  }

  eleventyConfig.on('eleventy.after', function() {
    logger.info('Caching IIIF images')
    const filePaths = filesToCache(assetDir)
    filePaths.forEach((filePath) => cache(filePath))
  })
}
