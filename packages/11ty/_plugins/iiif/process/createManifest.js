/**
 * Manifest Builder
 */
const { IIIFBuilder } = require('iiif-builder')
const { globalVault } = require('@iiif/vault')
const fs = require('fs-extra')
const mime = require('mime-types')
const path = require('path')
const sharp = require('sharp')
const vault = globalVault()
const builder = new IIIFBuilder(vault)
require('dotenv').config()

/**
 * @param  {Object} eleventyConfig
 * @return {Function}      createManifest
 */
module.exports = (eleventyConfig) => {
  const {
    imageServiceDirectory,
    input,
    locale,
    manifestFilename,
    output: defaultOutput,
    root
  } = eleventyConfig.globalData.iiifConfig

  /**
   * Accepts a figure from figures.yaml
   * Generates a manifest
   * Adds manifest to globalData `iiifManifests` property
   *
   * @param  {Object} figure Figure data from figures.yaml
   * @param  {Object} options
   * @property  {String} output (optional) overwrite default output
   */
  return async (figure, options={}) => {
    const { debug, output } = options
    const { id, label, choices } = figure

    const outputDir = output || defaultOutput
    const iiifId = [process.env.URL, outputDir, id].join('/')
    const manifestOutput = path.join(root, outputDir, id, manifestFilename)

    if (debug) {
      console.warn(`[iiif:lib:createManifest:${id}] Creating manifest`)
    }

    manifestId = [iiifId, manifestFilename].join('/')
    canvasId = [iiifId, 'canvas'].join('/')

    const defaultChoice =
      choices.find(({ default: defaultChoice }) => defaultChoice) || choices[0]
    const imagePath = path.join(
      input,
      path.parse(defaultChoice.src).base
    )
    const { height, width } = await sharp(imagePath).metadata()
    const manifest = builder.createManifest(manifestId, (manifest) => {
      manifest.addLabel(label, locale)
      manifest.createCanvas(canvasId, (canvas) => {
        canvas.height = height
        canvas.width = width
        if (Array.isArray(choices)) {
          const bodyItems = choices.map(({ label, src }) => {
            const name = path.parse(src).name
            const choiceId = [process.env.URL, outputDir, name].join('/')
            const format = mime.lookup(src)
            return {
              id: choiceId,
              format,
              height,
              type: 'Image',
              label: { en: [label] },
              service: [
                {
                  id: [process.env.URL, outputDir, name, imageServiceDirectory].join('/'),
                  type: 'ImageService3',
                  profile: 'level0'
                }
              ],
              width
            }
          })
          const annotationId = [canvasId, 'annotation'].join('/')
          canvas.createAnnotation(annotationId, {
            id: annotationId,
            type: 'Annotation',
            motivation: 'painting',
            body: {
              type: 'Choice',
              items: bodyItems
            }
          })
        }
      })
    })

    const jsonManifest = builder.toPresentation3(manifest)

    fs.ensureDirSync(path.join(root, outputDir, id))
    fs.writeJsonSync(manifestOutput, jsonManifest)

    eleventyConfig.addGlobalData('iiifManifests', {
      ...eleventyConfig.globalData.iiifManifests,
      [id]: jsonManifest
    })
  }
}
