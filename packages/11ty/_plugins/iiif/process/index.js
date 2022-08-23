const addGlobalData = require('./addGlobalData')
const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const initCreateImage = require('./createImage')
const initTileImage = require('./tileImage')
const Manifest = require('../manifest/index')
const ManifestWriter = require('../manifest/writer')
const path = require('path')
const pluralize = require('~lib/pluralize')
const { isImageService } = require('../helpers')

const { error, info } = chalkFactory('plugins:iiif')

/**
 * Creates tiles for zoomable images 
 * Processes image transformations from `config.imageTransformations`
 * Creates manifests for figures in figures.yaml with `annotations`
 * Outputs manifests, images, and tiles to IIIF config.output
 *
 * @param  {Object} eleventyConfig
 */
module.exports = {
  init: (eleventyConfig) => {
    info('Processing project image resources for IIIF.')
    /**
     * IIIF config
     */
    const { config, iiifConfig, figures } = eleventyConfig.globalData
    const { imageServiceDirectory, imageTransformations, outputDir, outputRoot } = iiifConfig

    const createImage = initCreateImage(eleventyConfig)
    const writer = new ManifestWriter(eleventyConfig)
    const tileImage = initTileImage(eleventyConfig)
    const outputPath = path.join(outputRoot, outputDir)
    const processedFiles = fs.existsSync(outputPath)
      ? fs.readdirSync(outputPath).filter((dir) => {
        return fs.lstatSync(path.join(outputPath, dir)).isDirectory()
      })
      : []
    const tiledImages = processedFiles.filter((dir) => {
      return fs.readdirSync(path.join(outputPath, dir)).includes(imageServiceDirectory)
    })

    const figuresToTile = figures.figure_list
      .flatMap((figure) => figure.annotations || figure)
      .filter((figure) => isImageService(figure) && !figure.src.startsWith('http'))
      .filter(({ src }) => !tiledImages.includes(path.parse(src).name))

    if (tiledImages.length) {
      info(`Skipping ${tiledImages.length} previously tiled ${pluralize(tiledImages.length, 'image')}.`)
    }

    if (figuresToTile.length) {
      info(`Tiling ${figuresToTile.length} ${pluralize(figuresToTile.length), 'image'}...`)
      info(`Generating IIIF image tiles may take a while depending on the size of each image file.`)
    } else {
      info(`No new images to tile found in figures.yaml.`)
    }

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
      figuresToTile.forEach((figure) => {
        if (debug) {
          info(`Tiling ${figure.id}`)
        }

        promises.push(
          imageTransformations.map((transformation) => {
            return createImage(figure, transformation, options);
          })
        )
        promises.push(tileImage(figure, options))
      })

      const tilingResponses = await Promise.all(promises)
      const errors = tilingResponses.filter(({ error }) => error)

      if (figuresToTile.length) {
        const errorMessage = errors.length ? ` with ${errors.length} ${pluralize(errors.length, 'error')}` : ''
        info(`Completed tiling ${figuresToTile.length} ${pluralize(figuresToTile.length, 'image')}${errorMessage}`)
      }

      if (errors.length) {
        error(`Unable to tile the following images:`)
        console.table(errors, ['filename', 'error'])
      }

      // Build manifests for figures with annotations
      const figuresWithAnnotations = figures.figure_list.filter(
        ({ annotations }) => annotations && annotations.length
      )

      if (figuresWithAnnotations.length) {
        const manifests = processedFiles.filter((dir) => {
          return fs.readdirSync(path.join(outputPath, dir)).includes('manifest.json')
        })
        info(`Generating ${figuresWithAnnotations.length} ${pluralize(figuresWithAnnotations.length, 'manifest')}.`)
        for (const figure of figuresWithAnnotations) {
          const manifest = new Manifest({ figure, writer })
          await manifest.write()
        }
        /**
         * @todo add error logging
         */
        info('Completed generating manifests.')
      }

      /**
       * Must follow creation of manifests
       * Adds necessary IIIF data for rendering to globalData.figures
       */
      await addGlobalData(eleventyConfig)

      info('Completed processing images.')
    }
  }
}
