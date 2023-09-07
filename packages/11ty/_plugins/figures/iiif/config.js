const chalkFactory = require('~lib/chalk')
const path = require('path')

const logger = chalkFactory('Figures:IIIF:Config', 'DEBUG')


module.exports = (eleventyConfig) => {
  const { url } = eleventyConfig.globalData.publication
  const { inputDir, outputDir, publicDir } = eleventyConfig.globalData.directoryConfig
  const { port=8080 } = eleventyConfig.serverOptions

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
      imagesDir: path.join('_assets', 'images'),
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
     * All transformations are applied to each image and output a separate file.
     *
     * @type {Array<Object>}
     * @property {String} name  Output file name
     * @property {Object} resize  Options passed to the `sharp.resize()` method
     * @see {@link https://sharp.pixelplumbing.com/api-resize}
     */
    transformations: [
      {
        name: 'thumbnail',
        resize: {
          width: 50
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
          width: 626
        }
      }
    ]
  }
}
