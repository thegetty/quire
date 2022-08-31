const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const mime = require('mime-types')
const path = require('path')
const sharp = require('sharp')
const titleCase = require('~plugins/filters/titleCase')
const { globalVault } = require('@iiif/vault')
const { IIIFBuilder } = require('iiif-builder')
const { error, info } = chalkFactory('Figure Processing:IIIF:Manifest')

const vault = globalVault()
const builder = new IIIFBuilder(vault)

module.exports = class Manifest {
  constructor({ figure, writer }) {
    const { outputDir, manifestFilename } = writer.iiifConfig
    const baseId = [process.env.URL, outputDir, figure.id].join('/')

    this.canvas = {
      id: [baseId, 'canvas'].join('/')
    }
    this.figure = figure
    this.iiifConfig = writer.iiifConfig
    this.manifestId = [baseId, manifestFilename].join('/')
    this.writer = writer
  }

  get annotations() {
    return this.figure.annotations
      .flatMap(({ items }) => items)
      .filter(({ type }) => type === 'annotation')
      .map(({ label, motivation, url }) => {
        /**
         * @todo create text annotation bodies
         */
        this.createAnnotation({
          id: url,
          label,
          motivation
        })
      })
  }

  /**
   * Use dimensions of figure.src or first choice as canvas dimensions
   */
  get canvasImagePath() {
    const firstChoice = this.figure.annotations
      .flatMap(({ items }) => items)
      .find(({ target }) => !target)
    const imagePath = this.figure.src || firstChoice.src
    if (!imagePath) {
      error(`Invalid figure ID "${this.figure.id}". Figures with annotations must have "choice" annotations or a "src" property.`)
    }
    return imagePath
  }

  get choices() {
    const choices = this.figure.annotations
      .flatMap(({ items }) => items)
      .filter(({ type }) => type === 'choice')

    const items = choices.map((item) => {
      const { url, label, src } = item
      if (!src) {
        error(`Invalid annotation on figure ID "${this.figure.id}". Annotations must have a "src" or "text" property`)
      }
      const { name } = path.parse(src)
      const format = mime.lookup(src)
      const choice = {
        id: url,
        format,
        height: this.canvas.height,
        type: 'Image',
        label: { en: [label] },
        width: this.canvas.width
      }
      if (this.figure.preset === 'zoom') {
        choice.service = [
          {
            id: url,
            type: 'ImageService3',
            profile: 'level0'
          }
        ]
      }
      return choice
    })

    return this.createAnnotation({
      body: {
        items,
        type: 'Choice',
      },
      id: 'choices',
      motivation: 'painting',
    })
  }

  async calcCanvasDimensions() {
    const { inputDir, inputRoot } = this.iiifConfig
    const fullImagePath = path.join(inputRoot, inputDir, this.canvasImagePath)
    const { height, width } = await sharp(fullImagePath).metadata()
    this.canvas.height = height
    this.canvas.width = width
    return { height, width }
  }

  createAnnotation({ body, id, motivation }) {
    return {
      body: body,
      id: [this.canvas.id, id].join('/'),
      motivation: motivation,
      type: 'Annotation'
    }
  }

  async toJSON() {
    const { height, width } = await this.calcCanvasDimensions()
    const manifest = builder.createManifest(this.manifestId, (manifest) => {
      manifest.addLabel(this.figure.label, this.iiifConfig.locale)
      manifest.createCanvas(this.canvas.id, (canvas) => {
        canvas.height = height
        canvas.width = width
        if (this.annotations) {
          this.annotations.forEach((item) => {
            canvas.createAnnotation(item.id, item)
          })
        }
        if (this.choices) {
          canvas.createAnnotation(this.choices.id, this.choices)
        }
      })
    })
    try {
      const json = builder.toPresentation3(manifest)
      info(`Generated manifest for figure "${this.figure.id}"`)
      return json
    } catch(errorMessage) {
      error(`Could not generate manifest for figure "${this.figure.id}": ${errorMessage}`)
    }
  }

  async write() {
    const manifest = await this.toJSON()
    this.writer.write({ figure: this.figure, manifest })
    return manifest
  }
}
