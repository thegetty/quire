/**
 * Manifest Builder
 */
const { IIIFBuilder } = require('iiif-builder')
const { globalVault } = require('@iiif/vault')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const vault = globalVault()
const builder = new IIIFBuilder(vault)
require('dotenv').config()

/**
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      copyManifest
 */
module.exports = (config) => {
  const {
    input,
    output: defaultOutput, 
    root,
    manifestFilename
  } = config

  /**
   * Accepts a figure from figures.yaml
   * Generates a manifest
   * Writes manifest to the _iiif directory
   *
   * @param  {Object} figure Figure data from figures.yaml
   * @param  {Object} options
   * @property  {String} output (optional) overwrite default output
   */
  return async (figure, options={}) => {
    const { id, choices } = figure
    const { debug, lazy, output } = options

    const outputDir = output || defaultOutput
    const iiifId = path.join(process.env.URL, outputDir, id)
    const manifestOutput = path.join(root, outputDir, id, manifestFilename)

    /**
     * Do not overwrite user-generated manifests
     */
    if (fs.pathExistsSync(path.join(input, id, manifestFilename))) {
      console.warn(`[iiif:lib:createManifest:${id}] User-generated manifest already exists, skipping`)
      return
    }

    console.warn(`[iiif:lib:createManifest:${id}] Creating manifest`)
    manifestId = `${iiifId}/${manifestFilename}`
    canvasId = `${iiifId}/canvas`

    const defaultChoice =
      choices.find(({ default: defaultChoice }) => defaultChoice) || choices[0]
    const imagePath = path.join(root, outputDir, defaultChoice.id, 'default.jpg')
    const { height, width } = await sharp(imagePath).metadata()
    const manifest = builder.createManifest(manifestId, (manifest) => {
      // manifest.addLabel('Image 1', 'en')
      manifest.createCanvas(canvasId, (canvas) => {
        canvas.height = height
        canvas.width = width
        if (Array.isArray(choices)) {
          const bodyItems = choices.map(({ id, label }) => {
            const choiceId = path.join(process.env.URL, outputDir, id)
            return {
              id: choiceId,
              height,
              type: 'Image',
              label: { en: [label] },
              width
            }
          })
          console.warn(bodyItems)
          canvas.createAnnotation(`${iiifId}/canvas/annotation`, {
            id: `${iiifId}/canvas/annotation`,
            type: 'Annotation',
            motivation: 'painting',
            body: {
              type: 'Choice',
              items: bodyItems
            },
          })
        }
      })
    })
    const jsonManifest = builder.toPresentation3({id: manifest.id, type: 'Manifest'})
    // console.warn(jsonManifest)
    fs.ensureDirSync(path.join(root, outputDir, id))
    fs.writeJsonSync(manifestOutput, jsonManifest)
  }
}
