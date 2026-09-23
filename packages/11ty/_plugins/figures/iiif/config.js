import chalkFactory from '#lib/chalk/index.js'
import path from 'node:path'

// eslint-disable-next-line no-unused-vars
const logger = chalkFactory('Figures:IIIF:Config', 'DEBUG')

export default (eleventyConfig) => {
  const { url } = eleventyConfig.globalData.publication
  const { inputDir, outputDir, publicDir } = eleventyConfig.globalData.directoryConfig
  const { imageDir } = eleventyConfig.globalData.config.figures
  const { port = 8080 } = eleventyConfig.serverOptions

  const projectRoot = path.resolve(inputDir, '..')

  // logger.debug(`projectRoot: ${projectRoot}`)

  const resolveInputPath = () => {
    const resolvedPath = path.resolve(inputDir)
    // logger.debug(`inputPath: ${resolvedPath}`)
    return resolvedPath
  }

  const resolveOutputPath = () => {
    const resolvedPath = publicDir
      ? path.resolve(projectRoot, publicDir)
      : path.resolve(projectRoot, outputDir)

    // logger.debug(`ouputPath: ${resolvedPath}`)
    return resolvedPath
  }

  return {
    baseURI: process.env.ELEVENTY_ENV === 'production'
      ? url
      : `http://localhost:${port}`,
    dirs: {
      /**
       * Image file directory relative to `inputRoot`
       */
      imagesDir: imageDir,
      /**
       * Root directory for input images
       */
      inputRoot: resolveInputPath(),
      /**
       * Output directory
       * @type {String}
       */
      outputPath: 'iiif',
      outputRoot: resolveOutputPath()
    },
    /**
     * Input/output of processable image formats
     * @type {Array<Object>}
     */
    formats: [
      {
        input: ['.png', '.svg'],
        /**
         * Change to '.png' when canvas-panel preferredFormats issue is resolved
         * @link https://github.com/digirati-co-uk/iiif-canvas-panel/issues/193
         */
        output: '.jpg'
      },
      {
        input: ['.jp2', '.jpg', '.jpeg', '.tif', '.tiff'],
        output: '.jpg'
      }
    ],
    /**
     * Whether to host external IIIF images.
     * `true` re-creates image tiles in the publication
     * `false` uses the external URLs directly in manifests / pages
     * @type {Boolean}
     **/
    hostExternal: true,
    /**
     * Locale of the generated manifest
     * @type {String}
     */
    locale: 'en',
    /**
     * File name for the generated manifest
     * @type {String}
     */
    manifestFileName: 'manifest.json',
    /**
     * @object printComposites
     * @property {Number} bottomMargin Bottom margin
     * @property {Number} itemGap Gap between row grid items and each row
     * @property {Number} itemTileSize Maximum size of individual images when gridded
     * @property {Number} leftMargin Left margin
     * @property {Number} rightMargin Right Margin
     * @property {Number} topMargin Top Margin
     * @property {Number} width Image width, the maximum length of a grid row plus left / right margins
     * 
     * Confgiruation for grid composites
     *
     **/ 
    printComposites: {
      bottomMargin: 24,
      itemGap: 12,
      itemTileSize: 900,
      leftMargin: 24,
      rightMargin: 24,
      topMargin: 24,
      width: 1800,
    },
    /**
     * Directory name appended to the output path for tiles and `info.json`
     * @type {String}
     */
    tilesDirName: 'tiles',
    /**
     * Size in pixels of the smallest image tile after slicing
     * @type {Number}
     */
    tileSize: 256,
    /**
     * Each figure image generates an output file from each transformation.
     *
     * @type {Array<Object>}
     * @property {String} name  Output file name
     * @property {Object} resize  Options passed to the `sharp.resize()` method
     * @see {@link https://sharp.pixelplumbing.com/api-resize}
     *
     */
    transformations: [
      {
        name: 'full',
        resize: {}
      },
      {
        name: 'thumbnail',
        resize: {
          width: 320
        }
      },
      /**
       * Transformation applied to IIIF resources for use in PDF and EPUB
       */
      {
        name: 'print-image',
        resize: {
          width: 2025,
          withoutEnlargement: true
        }
      },
      /**
       * Transformation applied to IIIF resources for use in inline figures
       */
      {
        name: 'static-inline-figure-image',
        resize: {
          width: 640
        }
      }
    ]
  }
}
