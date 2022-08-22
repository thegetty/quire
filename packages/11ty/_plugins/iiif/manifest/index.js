const fs = require('fs-extra')
const mime = require('mime-types')
const path = require('path')
const sharp = require('sharp')
const titleCase = require('~plugins/filters/titleCase')
const { globalVault } = require('@iiif/vault')
const { IIIFBuilder } = require('iiif-builder')

const vault = globalVault()
const builder = new IIIFBuilder(vault)

module.exports = class Manifest {
  constructor(iiifConfig, figure) {
    const { outputDir, manifestFilename } = iiifConfig
    const baseId = [process.env.URL, outputDir, figure.id].join('/')

    this.canvas = {
      id: [baseId, 'canvas'].join('/')
    }
    this.figure = figure
    this.iiifConfig = iiifConfig
    this.manifestId = [baseId, manifestFilename].join('/')
  }

  get annotations() {
    return this.figure.annotations
      .flatMap(({ items }) => items)
      .filter((item) => item.target && item.src)
      .map((item) => {
        let motivation
        switch(true) {
          case !!item.src:
            motivation = 'painting'
            break
          case !!item.text:
            motivation = 'text'
            break
          default:
            console.error(`Unhandled annotation type. Must be 'painting', or 'text'`)
            break;
        }
        /**
         * @todo create text and image annotation bodies
         */
        this.createAnnotation({
          id,
          label: this.getAnnotationLabel(item),
          motivation
        })
      })
  }

  get choices() {
    const choices = this.figure.annotations
      .flatMap(({ items }) => items)
      .filter((item) => !item.target && item.src)

    const items = choices.map((item) => {
      const { src } = item
      const label = this.getAnnotationLabel(item)
      const { name }= path.parse(src)
      const choiceId = new URL([this.iiifConfig.imageDir, src].join('/'), process.env.URL).href
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

  async create() {
    const { height, width } = await this.getCanvasMetadata()
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
    this.manifest = manifest
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

  /**
   * Use dimensions of figure.src or first choice as canvas dimensions
   */
  get canvasImagePath() {
    const firstChoice = this.figure.annotations
      .flatMap(({ items }) => items)
      .find(({ target }) => !target)
    return this.figure.src || firstChoice.src
  }

  async getCanvasMetadata() {
    const fullImagePath = path.join(this.iiifConfig.inputDir, this.canvasImagePath)
    const { height, width } = await sharp(fullImagePath).metadata()
    this.canvas.height = height
    this.canvas.width = width
    return { height, width }
  }

  async toJSON() {
    await this.create()
    return builder.toPresentation3(this.manifest)
  }
}
