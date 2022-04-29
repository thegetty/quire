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
 * @param  {Object} config Quire IIIF Process config
 * @return {Function}      copyManifest
 */
module.exports = (config) => {
  const {
    imageServiceDirectory,
    input,
    locale,
    manifestFilename,
    output: defaultOutput,
    root
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
    const { debug, lazy, output } = options
    const { id, label, choices } = figure

    const outputDir = output || defaultOutput
    const iiifId = [process.env.URL, outputDir, id].join("/")
    const manifestOutput = path.join(root, outputDir, id, manifestFilename)

    /**
     * Do not overwrite user-generated manifests
     */
    if (fs.pathExistsSync(path.join(input, id, manifestFilename))) {
      console.warn(`[iiif:lib:createManifest:${id}] User-generated manifest already exists, skipping`)
      return
    }

    if (lazy && fs.pathExistsSync(manifestOutput)) {
      console.warn(
        `[iiif:lib:createManifest:${id}] Manifest already created, skipping.`
      )
      return
    }

    console.warn(`[iiif:lib:createManifest:${id}] Creating manifest`)
    manifestId = `${iiifId}/${manifestFilename}`
    canvasId = `${iiifId}/canvas`

    const defaultChoice =
      choices.find(({ default: defaultChoice }) => defaultChoice) || choices[0]
    const imagePath = path.join(
      root,
      outputDir,
      defaultChoice.id,
      "default.jpg"
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
                  type: "ImageService3",
                  profile: "level0"
                }
              ],
              width
            }
          })
          canvas.createAnnotation(`${iiifId}/canvas/annotation`, {
            id: `${iiifId}/canvas/annotation`,
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
  }
}
