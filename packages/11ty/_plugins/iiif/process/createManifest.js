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
    inputDir,
    locale,
    manifestFilename,
    outputDir,
    outputRoot
  } = eleventyConfig.globalData.iiifConfig
  const { imageDir } = eleventyConfig.globalData.config.params

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
    const { id, label, choiceId, choices, preset } = figure

    const iiifId = [process.env.URL, outputDir, id].join('/')
    const manifestOutput = path.join(outputRoot, outputDir, id, manifestFilename)

    if (debug) {
      console.warn(`[iiif:lib:createManifest:${id}] Creating manifest`)
    }

    manifestId = [iiifId, manifestFilename].join('/')
    canvasId = [iiifId, 'canvas'].join('/')

    const defaultChoice =
      choices.find(({ default: defaultChoice }) => defaultChoice) || choices[0]

    const imagePath = choiceId
      ? choiceId
      : path.join(inputDir, defaultChoice.src)

    const { height, width } = await sharp(imagePath).metadata()
    const manifest = builder.createManifest(manifestId, (manifest) => {
      manifest.addLabel(label, locale)
      manifest.createCanvas(canvasId, (canvas) => {
        canvas.height = height
        canvas.width = width
        if (Array.isArray(choices)) {
          const bodyItems = choices.map(({ label, src }) => {
            const name = path.parse(src).name
            const choiceId = new URL([imageDir, src].join('/'), process.env.URL).href
            const format = mime.lookup(src)
            const choice = {
              id: choiceId,
              format,
              height,
              type: 'Image',
              label: { en: [label] },
              width
            }
            if (preset === 'zoom') {
              const serviceId = new URL([outputDir, name, imageServiceDirectory].join('/'), process.env.URL)
              choice.service = [
                {
                  id: serviceId,
                  type: 'ImageService3',
                  profile: 'level0'
                }
              ]
            }
            return choice
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

    fs.ensureDirSync(path.parse(manifestOutput).dir)
    fs.writeJsonSync(manifestOutput, jsonManifest)

    eleventyConfig.addGlobalData('iiifManifests', {
      ...eleventyConfig.globalData.iiifManifests,
      [id]: jsonManifest
    })
  }
}
