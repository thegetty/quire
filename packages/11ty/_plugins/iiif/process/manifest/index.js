const { globalVault } = require('@iiif/vault')
const vault = globalVault()
const { IIIFBuilder } = require('iiif-builder')
const builder = new IIIFBuilder(vault)
const Annotation = require('./annotation')
const Base = require('./base')
const Canvas = require('./canvas')
const Choices = require('./choices')

module.exports = class Manifest extends Base {
  constructor(data) {
    super(data)

    this.canvas = new Canvas(data)
    this.manifestId = [this.baseId, this.iiifConfig.manifestFilename].join('/')
  }

  get annotations() {
    return this.figure.annotations
      .flatMap(({ items }) => items)
      .filter((item) => item.target && item.src)
      .map((item) => new Annotation(this.data, this.canvas, item))
  }

  get choices() {
    const choices = this.figure.annotations
      .flatMap(({ items }) => items)
      .filter((item) => !item.target && item.src)
    return new Choices(this.data, this.canvas, choices)
  }

  async json() {
    const { height, width } = await this.canvas.getDimensions()
    this.canvas.height = height
    this.canvas.width = width
    const manifest = builder.createManifest(this.manifestId, (manifest) => {
      manifest.addLabel(this.figure.label, this.iiifConfig.locale)
      manifest.createCanvas(this.canvas.id, (canvas) => {
        canvas.height = height
        canvas.width = width
        if (this.annotations) {
          this.annotations.forEach((item) => {
            const annotation = item.create()
            canvas.createAnnotation(annotation.id, annotation)
          })
        }
        if (this.choices) {
          const choices = this.choices.create()
          canvas.createAnnotation(this.choices.id, choices)
        }
      })
    })

    return builder.toPresentation3(manifest)
  }
}
