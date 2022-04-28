const fs = require('fs-extra')
const path = require('path')
const getFilePaths = require('./getFilePaths')
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
  init: ({ globalData }) => {
    /**
     * IIIF config
     */
    const { iiifConfig } = globalData
    const {
      imageTransformations,
      input,
      manifestFilename,
      output,
      root,
      supportedImageExtensions
    } = iiifConfig

    const createImage = initCreateImage(iiifConfig)
    const createManifest = initCreateManifest(iiifConfig)
    const tileImage = initTileImage(iiifConfig)

    const seedImages = getFilePaths(input, { exts: supportedImageExtensions });
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
        const id = path.parse(imagePath).name

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

      await Promise.all(promises)

      if (debug) {
        console.warn(`[iiif:processImages] Done`)
      }
    }
  }
}
