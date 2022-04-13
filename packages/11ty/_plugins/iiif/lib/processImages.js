const fs = require('fs-extra')
const path = require('path')
const createManifest = require('./createManifest')
const tileImage = require('./tileImage')
const { figures } = require('../../globalData')
const sharp = require('sharp')
require('dotenv').config()

/**
 * Creates an image with metadata in the output directory with the name `default.${ext}`
 * @todo what should the size be? currently arbitrarily setting it to 800
 * 
 * @param  {String} input   input file path
 * @param  {String} output  output directory
 * @param  {Object} options
 */
const createDefaultImage = (input, output, options = {}) => {
  const { debug, lazy } = options
  const { ext } = path.parse(input)

  const fileOutput = path.join(output, `default${ext}`)

  if (!lazy || !fs.pathExistsSync(fileOutput)) {
    sharp(input)
      .resize({ width: 800 })
      .withMetadata()
      .toFile(fileOutput)

    if (debug) {
      console.warn(`[iiif:lib:processImage:${id}] Created default image`)
    }
  }
}

/**
 * Creates a thumbnail image in the output directory with the name `thumb.${ext}`
 * 
 * @param  {String} input   input file path
 * @param  {String} output  output directory
 * @param  {Object} options
 */
const createThumbnail = (input, output, options = {}) => {
  const { debug, lazy } = options
  const { ext } = path.parse(input)
  const id = getId(input)

  const fileOutput = path.join(output, `thumb${ext}`)

  if (!lazy || !fs.pathExistsSync(fileOutput)) {
    sharp(input)
      .resize({ width: 50 })
      .withMetadata()
      .toFile(fileOutput)

    if (debug) {
      console.warn(`[iiif:lib:processImage:${id}] Created thumbnail`)
    }
  }
}

/**
 * Returns a list of the paths to supported image files in a directory
 * @param  {String} directory
 * @return {Array<String>} List of image file paths           
 */
const getFilePaths = (directory) => {
  const supportedExts = [
    '.jp2',
    '.jpg',
    '.jpeg',
    '.png',
    '.svg',
    '.tif',
    '.tiff',
  ]
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

/**
 * Get figure id from seed file path
 * @return {String} [description]
 */
const getId = (filePath) => {
  const { dir } = path.parse(filePath)
  const dirParts = dir.split(path.sep)
  return dirParts[dirParts.length - 1]
}

/**
 * Iterates over IIIF seed directory and creates tiles, a default image and thumbnail, and manifest for each image
 * @todo Creates manifests for figures with `choices`
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} options
 * @property  {Boolean} lazy If true, only processes new images. Default: true
 */
module.exports = async (config, options = {}) => {
  const { root, input, output } = config

  const defaultOptions = {
    debug: true,
    lazy: true,
  }
  const { debug, lazy } = { ...defaultOptions, options }

  const filenames = getFilePaths(input)

  filenames.forEach(async(filename) => {
    const id = getId(filename)

    if (debug) {
      console.warn(`[iiif:lib:processImage:${id}] Starting`)
    }

    const outputFilePath = path.join(root, output, id)

    createThumbnail(filename, outputFilePath, options)
    createDefaultImage(filename, outputFilePath, options)
    tileImage(filename, outputFilePath, options)

    // Build manifests for figures with choices
    // const figuresWithChoices = figures.figure_list.filter(
    //   ({ choices }) => choices && choices.length
    // )
    // const promises = figuresWithChoices.map((figure) => {
    //   return createManifest(figure)
    // })
    // await Promise.all(promises)

    // Copy user-generated manifests to _iiif directory
    const manifestInput = path.join(input, id, 'manifest.json')
    const manifestOutput = path.join(outputFilePath, 'manifest.json')

    if (fs.pathExistsSync(manifestInput) && (!lazy || !fs.pathExistsSync(manifestOutput))) {
      if (debug) {
        console.warn(`[iiif:lib:processImage:${id}] Using user-generated manifest`)
      }
      fs.copyFileSync(manifestInput, manifestOutput)
    }
  })
}
