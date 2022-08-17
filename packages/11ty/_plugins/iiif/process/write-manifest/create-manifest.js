const { globalVault } = require('@iiif/vault')
const vault = globalVault()
const { IIIFBuilder } = require('iiif-builder')
const builder = new IIIFBuilder(vault)
const initCreateCanvas = require('./create-canvas')
const { getIIIFBaseId } = require('~plugins/iiif/helpers')

/**
 * Generates manifest JSON from figure data
 * @param  {Object} eleventyConfig
 */
module.exports = function (eleventyConfig) {
  const { locale, manifestFilename, outputDir } = eleventyConfig.globalData.iiifConfig

  return async function (figure) {
    const { annotations, id, label } = figure
    const iiifId = [process.env.URL, outputDir, id].join('/')
    const createCanvas = await initCreateCanvas(eleventyConfig, figure, iiifId)

    const manifestId = [iiifId, manifestFilename].join('/')
    const manifest = builder.createManifest(manifestId, (manifest) => {
      manifest.addLabel(label, locale)
      createCanvas(manifest)
    })

    return builder.toPresentation3(manifest)
  }
}
