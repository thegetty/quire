const fs = require('fs-extra')
const path = require('path')
const tileImage = require('./tileImage')
require('dotenv').config()

/**
 * Iterates over IIIF image directory and creates tiles and manifests for each image
 *
 * Expects the IIIF directory to follow biiif conventions of folder organization
 * See: https://github.com/IIIF-Commons/biiif#examples
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} options
 * @property  {Boolean} lazy If true, only processes new images. Default: true
 */
const supportedExts = [
  '.jp2',
  '.jpg',
  '.jpeg',
  '.png',
  '.svg',
  '.tif',
  '.tiff',
]

const getFilePaths = (directory) => {
  const filenames = fs.readdirSync(directory)
  return filenames.flatMap((filename) => {
    const filePath = path.join(directory, filename)
    if (fs.lstatSync(filePath).isDirectory()) {
      return getFilePaths(filePath)
    }
    const { ext } = path.parse(filename)
    if (supportedExts.includes(ext)) {
      return filePath
    }
  }).filter(item => item)
}

module.exports = async (options = {}) => {
  const defaultOptions = {
    debug: true,
    lazy: true,
  }
  const { debug, lazy } = { ...defaultOptions, options }

  const root = 'content'
  const seedDirectory = path.join(root, '_assets', 'images', 'figures', 'iiif')
  const outputDirectory = path.join('_assets', 'images', '_iiif')

  const filenames = getFilePaths(seedDirectory)

  filenames.forEach((filename) => {
    const { dir } = path.parse(filename)
    const dirParts = dir.split(path.sep)
    const id = dirParts[dirParts.length - 1]

    if (debug) {
      console.warn(`[iiif:lib:processImage:${id}] Starting`)
    }

    const outputFilePath = path.join(root, outputDirectory, id)
    tileImage({
      input: filename,
      output: outputFilePath
    }, { debug, lazy })

    // if user-generated manifest exists, copy to _iiif directory
    const passthroughManifest = path.join(seedDirectory, id, 'manifest.json')
    if (fs.pathExistsSync(passthroughManifest)) {
      if (debug) {
        console.warn(`[iiif:lib:processImage:${id}] Using user-generated manifest`)
      }
      fs.copyFileSync(passthroughManifest, path.join(outputFilePath, 'manifest.json'))
    } else {
      if (debug) {
        console.warn(`[iiif:lib:processImage:${id}] Creating manifest`)
      }
      // createManifest()
    }
  })
}
