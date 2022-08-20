const Annotation = require('./annotation')
const Base = require('./base')
const Canvas = require('./canvas')
const Choices = require('./choices')
const fs = require('fs-extra')
const path = require('path')
const { globalVault } = require('@iiif/vault')
const { IIIFBuilder } = require('iiif-builder')

const vault = globalVault()
const builder = new IIIFBuilder(vault)

module.exports = class Manifest extends Base {
  constructor(iiifConfig, figure) {
    super(iiifConfig)

    this.canvas = new Canvas(iiifConfig, figure)
    this.figure = figure
  }

  get annotations() {
    return this.figure.annotations
      .flatMap(({ items }) => items)
      .filter((item) => item.target && item.src)
      .map((item) => new Annotation(this.iiifConfig, this.canvas, item))
  }

  get choices() {
    const choices = this.figure.annotations
      .flatMap(({ items }) => items)
      .filter((item) => !item.target && item.src)
    return new Choices(this.iiifConfig, this.canvas, choices)
  }

  async create() {
    const manifestId = [this.getBaseId(this.figure.id), this.iiifConfig.manifestFilename].join('/')
    const { height, width } = await this.canvas.getDimensions()
    const manifest = builder.createManifest(manifestId, (manifest) => {
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
    this.manifest = manifest
  }

  getBaseId() {
    return [process.env.URL, this.iiifConfig.outputDir, this.figure.id].join('/')
  }

  async toJSON() {
    await this.create()
    return builder.toPresentation3(this.manifest)
  }

  write(json) {
    if (!json) {
      console.error('can\'t write no json')
    }
    const outputPath = path.join(
      this.iiifConfig.outputRoot,
      this.iiifConfig.outputDir,
      this.figure.id,
      this.iiifConfig.manifestFilename
    );
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeJsonSync(outputPath, json)
  }
}
