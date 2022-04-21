const fs = require('fs-extra')
const path = require('path')
const getId = require('./getId')
const getFilePaths = require('./getFilePaths')
const initCopyManifest = require('./copyManifest')
const initCreateImage = require('./createImage')
const initCreateManifest = require('./createManifest')
const initTileImage = require('./tileImage')
const { figures } = require('../../globalData')

/**
 * Iterates over IIIF seed directory and creates tiles, a default image and thumbnail, and manifest for each image
 * @todo Creates manifests for figures with `choices`
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} options
 * @property  {Boolean} lazy If true, only processes new images. Default: true
 */

module.exports = {
  init: (config) => {
    const {
      imageVariations,
      input,
      manifestFilename,
      output,
      root,
      supportedImageExtensions
    } = config

    const copyManifest = initCopyManifest(config)
    const createImage = initCreateImage(config)
    const createManifest = initCreateManifest(config)
    const tileImage = initTileImage(config)

    const seedImages = getFilePaths(input, { exts: supportedImageExtensions });
    const manifestsToCopy = getFilePaths(input, { names: [manifestFilename] })

    return async(options = {}) => {
      options = {
        debug: true,
        lazy: true,
        ...options
      }
      const { debug, lazy } = options

      const promises = []
      seedImages.map(async(imagePath) => {
        const id = getId(imagePath)

        if (debug) {
          console.warn(`[iiif:processImages:${id}] Starting`)
        }

        promises.push(
          imageVariations.map((variation) => {
            return createImage(imagePath, { ...options, ...variation });
          })
        )
        promises.push(tileImage(imagePath, options))
      })

      // Build manifests for figures with choices
      const figuresWithChoices = figures.figure_list.filter(
        ({ choices }) => choices && choices.length
      )
      promises.push(figuresWithChoices.map((figure) => {
        return createManifest(figure, options)
      }))

      // Copy user-generated manifests to _iiif directory
      manifestsToCopy.forEach((filePath) => {
        copyManifest(filePath)
      })

      await Promise.all(promises)

      if (debug) {
        console.warn(`[iiif:processImages] Done`)
      }
    }
  }
}
