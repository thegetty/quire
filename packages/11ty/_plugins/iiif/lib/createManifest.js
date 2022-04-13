/**
 * Manifest Builder
 *
 * @todo
 * - add iiifDirectory to eleventy config data ?
 */
const { IIIFBuilder } = require('iiif-builder')
const { globalVault } = require('@iiif/vault')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const vault = globalVault()
const builder = new IIIFBuilder(vault)

/**
 * Accepts a figure from figures.yaml
 * Generates a manifest
 * Writes manifest to the _iiif directory
 *
 * @param  {Object} figure Figure data from figures.yaml
 * @return {Object} status 'success' or 'error' with messages
 */
module.exports = async (figure, options={}) => {
  const { id, choices } = figure
  const root = 'content'
  const iiifDirectory = path.join('_assets', 'images', '_iiif')
  const iiifId = path.join(process.env.URL, iiifDirectory, id)
  const manifestOutput = path.join(root, iiifDirectory, id, 'manifest.json')

  if (fs.pathExistsSync(manifestOutput)) {
    console.warn('user-generated manifest exists, skipping')
    return
  }
  manifestId = `${iiifId}/manifest.json`
  canvasId = `${iiifId}/canvas`

  const defaultChoice =
    choices.find(({ default: defaultChoice }) => defaultChoice) || choices[0]
  const imagePath = path.join(root, iiifDirectory, defaultChoice.id, 'default.jpg')
  const { height, width } = await sharp(imagePath).metadata()

  const manifest = builder.createManifest(manifestId, (manifest) => {
    // manifest.addLabel('Image 1', 'en')
    manifest.createCanvas(canvasId, (canvas) => {
      canvas.height = height
      canvas.width = width
      if (Array.isArray(choices)) {
        const bodyItems = choices.map(({ id, label }) => {
          const choiceId = path.join(process.env.URL, iiifDirectory, id)
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
  fs.ensureDirSync(path.join(iiifDirectory, id))
  fs.writeJsonSync(manifestOutput, jsonManifest)
}
