const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const mime = require('mime-types')
const path = require('path')
const sharp = require('sharp')
const titleCase = require('~plugins/filters/titleCase')
const { globalVault } = require('@iiif/vault')
const { IIIFBuilder } = require('iiif-builder')
const { error } = chalkFactory('plugins:iiif:manifest')

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
      .filter((item) => item.target && item.src)
      .map((item) => {
        let id, motivation
        switch(true) {
          case !!item.src:
            id = path.parse(src).name
            motivation = 'painting'
            break
          case !!item.text:
            id = item.label.split(' ').join('-').toLowerCase()
            motivation = 'text'
            break
          default:
            break;
        }
        /**
         * @todo create text and image annotation bodies
         */
        this.createAnnotation({
          id: item.id || id,
          label: this.getAnnotationLabel(item),
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
      .filter((item) => !item.target && item.src)

    const items = choices.map((item) => {
      const { src } = item
      if (!src) {
        error(`Invalid annotation on figure ID "${this.figure.id}". Annotations must have a "src" or "text" property`)
      }
      const label = this.getAnnotationLabel(item)
      const { name } = path.parse(src)
      const choiceId = new URL([this.iiifConfig.inputDir, src].join('/'), process.env.URL).href
      const format = mime.lookup(src)
      const choice = {
        id: choiceId,
        format,
        height: this.canvas.height,
        type: 'Image',
        label: { en: [label] },
        width: this.canvas.width
      }
      if (this.figure.preset === 'zoom') {
        const serviceId = new URL([this.iiifConfig.outputDir, name, this.iiifConfig.imageServiceDirectory].join('/'), process.env.URL)
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

  getAnnotationLabel({ label, src }) {
    const filename = src ? path.parse(src).name : null
    return label || titleCase(filename)
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
    return builder.toPresentation3(manifest)
  }

  async write() {
    const manifest = await this.toJSON()
    this.writer.write({ figure: this.figure, manifest })
  }
}
