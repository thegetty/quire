const fs = require('fs-extra')
const path = require('path')
const { build: biiif } = require('biiif')
require('dotenv').config();

/**
 * Iterates over IIIF image directory and uses biiif to process images
 * in the eleventy beforeBuild hook
 *
 * Expects the IIIF directory to follow biiif conventions of folder organization
 * See: https://github.com/IIIF-Commons/biiif#examples
 * 
 * @param  {Object} eleventyConfig
 * @param  {Object} options
 * @property  {Boolean} lazy If true, only processes new images. Default: true
 */
module.exports = (options = {}) => {
  const defaultOptions = { 
    debug: false,
    lazy: true
  }
  const { debug, lazy } = { ...defaultOptions, options }

  const root = 'content'
  const iiifDirectory = path.join('_assets', 'images', 'iiif')

  const filenames = fs.readdirSync(path.join(root, iiifDirectory))
    filenames.forEach((filename) => {
      const canvas = path.join(root, iiifDirectory, filename)
      if (fs.lstatSync(canvas).isDirectory()) {
        const manifest = path.join(canvas, 'index.json')
        if (!lazy) {
          /**
           * @todo clean up old tiles and manifest
           */
        }
        if (!lazy || !fs.pathExistsSync(manifest)) {
          if (debug) {
            console.warn(`[iiif:lib:processImage] Processing '${filename}'`)
          }
          const destination = path.join(process.env.URL, iiifDirectory, filename)
          biiif(canvas, destination)
        } else {
          if (debug) {
            console.warn(
            `[iiif:lib:processImage] Image "${filename}" has already been processed, skipping.`
            )
          }
        }
      }
    })
}
