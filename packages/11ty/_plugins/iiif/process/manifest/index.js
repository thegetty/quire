const { globalVault } = require('@iiif/vault')
const vault = globalVault()
const { IIIFBuilder } = require('iiif-builder')
const builder = new IIIFBuilder(vault)
const Canvas = require('./canvas')

module.exports = class Manifest {
  constructor({ eleventyConfig, figure }) {
    const { locale, manifestFilename, outputDir } =
      eleventyConfig.globalData.iiifConfig
    const iiifId = [process.env.URL, outputDir, id].join("/")

    this.annotations = figure.annotations
      .flatMap(({ items }) => items)
      .map((annotation) => new Annotation({ annotation, eleventyConfig, figure }))
    this.canvas = new Canvas({ eleventyConfig, figure })
    this.config = eleventyConfig.globalData.iiifConfig
    this.figure = figure
    this.locale = locale
    this.manifestId = [iiifId, manifestFilename].join('/')
  }

  create() {
    const manifest = builder.createManifest(manifestId, (manifest) => {
      manifest.addLabel(this.figure.label, this.locale)
      manifest.createCanvas(this.canvas.id, (canvas) => {
        canvas.height = this.canvas.height
        canvas.width = this.canvas.width
        if (this.annotations) {
          this.annotations.forEach((annotation) => {
            const annotationId = [this.canvas.id, 'annotation', annotation.id].join('/')
            canvas.createAnnotation(annotationId, annotation.create())
          })
        }
        if (this.choices) {
          const choiceId = [this.canvas.id, 'choices'].join('/')
          canvas.createAnnotation(choiceId, this.choices.createAnnotation())
        }
      })
    })

    return builder.toPresentation3(manifest)
  }
}
