const fs = require('fs')
const path = require('path')
const getId = require('./getId')

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      copyManifest()
 */
module.exports = (config) => {
  const { 
    output: defaultOutput,
    manifestFilename,
    root
  } = config

/**
 * Copies manifest from iiif input directory to output directory
 * Overwrites existing manifest if lazy === false
 * 
 * @param  {String} input   [description]
 * @param  {String} output  [description]
 * @param  {Object} options
 */
  return (input, output, options = {}) => {
    const { debug, lazy } = options

    const outputDir = output || defaultOutput
    const id = getId(input)

    const outputFilePath = path.join(root, outputDir, id, manifestFilename)
    if (!lazy || !fs.pathExistsSync(outputFilePath)) {
      if (fs.pathExistsSync(outputFilePath)) {
        fs.rmSync(outputFilePath)
      }
      if (debug) {
        console.warn(`[iiif:${id}] Using user-generated manifest`)
      }
      fs.ensureDirSync(path.join(outputDir, id))
      fs.copyFileSync(input, outputFilePath)
    } else {
      if (debug) {
        console.warn(`[iiif:${id}] Manifest already exists, skipping`)
      }
    }
  }
}
