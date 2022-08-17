/**
 * Manifest Builder
 */
const fs = require('fs-extra')
const path = require('path')
require('dotenv').config()
const chalkFactory = require('~lib/chalk')
const { info, error } = chalkFactory('plugins:iiif:write-manifest')
const initCreateManifest = require('./create-manifest')

/**
 * @param  {Object} eleventyConfig
 * @return {Function}      createManifest
 */
module.exports = (eleventyConfig) => {
  const {
    manifestFilename,
    outputDir,
    outputRoot
  } = eleventyConfig.globalData.iiifConfig

  /**
   * Accepts a figure from figures.yaml
   * Generates a manifest
   * Adds manifest to globalData `iiifManifests` property
   *
   * @param  {Object} figure Figure data from figures.yaml
   * @param  {Object} options
   * @property  {Boolean} debug Default false
   * @property  {Boolean} lazy Default true
   */
  return async (figure, options={}) => {
    const { debug, lazy } = options
    const { id } = figure

    const manifestOutput = path.join(outputRoot, outputDir, id, manifestFilename)
    const createManifest = initCreateManifest(eleventyConfig)

    /**
     * Create canvas
     */
    // if canvas has src, use to create canvas dimensions
    // if canvas does not have a src, use first choice to create dimensions
    // if canvas does not have choices or src, log error

    /**
     * Add annotations to canvas
     */
    // add choices to canvas
    // add image annotations to canvas
    // add text annotations to canvas

    const jsonManifest = await createManifest(figure)

    if (debug) {
      info(`Writing manifest to: ${manifestOutput}`)
    }

    fs.ensureDirSync(path.parse(manifestOutput).dir)
    fs.writeJsonSync(manifestOutput, jsonManifest)

    eleventyConfig.addGlobalData('iiifManifests', {
      ...eleventyConfig.globalData.iiifManifests,
      [id]: jsonManifest
    })
  }
}
