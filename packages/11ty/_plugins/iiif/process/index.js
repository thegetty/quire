const fs = require('fs')
const path = require('path')
const getId = require('./getId')
const getFilePaths = require('./getFilePaths')
const iiifConfig = require('../config')
const initCopyManifest = require('./copyManifest')
const initCreateImage = require('./createImage')
const initCreateManifest = require('./createManifest')
const initTileImage = require('./tileImage')
const { figures } = require('../../globalData')

/**
 * Creates tiles, default image, thumbnail, and manifest for each image in IIIF config `input` directory
 * Creates manifests for figures in figures.yaml with `choices`
 * Outputs manifests, images, and tiles to IIIF config.output
 *
 * @param  {Object} eleventyConfig
 */
module.exports = {
  init: (eleventyConfig) => {
    /**
     * IIIF config
     */
    const config = iiifConfig(eleventyConfig)
    const {
      imageTransformations,
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

    /**
     * IIIF Processor
     * @param  {Object} options
     * @property  {Boolean} debug Default `false`
     * @property  {Boolean} lazy If true, only processes new images. Default `true`
     */
    return async(options = {}) => {
      options = {
        debug: false,
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
          imageTransformations.map((variation) => {
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

      // Copy user-generated manifests to output directory
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
