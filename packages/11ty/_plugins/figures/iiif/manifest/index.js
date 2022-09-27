const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const titleCase = require('~plugins/filters/titleCase')
const { globalVault } = require('@iiif/vault')
const { IIIFBuilder } = require('iiif-builder')
const { error, info } = chalkFactory('Figure Processing:IIIF:Manifest')

const vault = globalVault()
const builder = new IIIFBuilder(vault)

module.exports = class Manifest {
  constructor({ figure, iiifConfig, writer }) {
    const { baseURL, manifestFilename } = iiifConfig
    const baseId = [baseURL, figure.outputDir].join('/')

    this.canvas = {
      id: [baseId, 'canvas'].join('/')
    }
    this.figure = figure
    this.iiifConfig = iiifConfig
    this.manifestId = [baseId, manifestFilename].join('/')
    this.writer = writer
  }

  get annotations() {
    const annotations = this.figure.annotations
      .flatMap(({ items }) => items)
      .filter(({ type }) => type === 'annotation')
      .map((item) => {
        return this.createAnnotation({
          body: this.createAnnotationBody(item),
          ...item
        })
      })
      /**
       * Add the "base" image as a canvas annotation
       */
      if (this.figure.baseImage) { 
        annotations.unshift(this.createAnnotation({
          body: this.createAnnotationBody(this.figure.baseImage),
          ...this.figure.baseImage
        }))
      }
      return annotations
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

    if (!choices.length) return

    const items = choices.map((item) => {
      if (!item.src) {
        error(`Invalid annotation on figure ID "${this.figure.id}". Annotations must have a "src" or "text" property`)
      }
      return this.createAnnotationBody(item)
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
    const { dirs } = this.iiifConfig
    const fullImagePath = path.join(dirs.inputRoot, dirs.input, this.canvasImagePath)
    const { height, width } = await sharp(fullImagePath).metadata()
    this.canvas.height = height
    this.canvas.width = width
    return { height, width }
  }

  createAnnotation({ body, id, motivation, target }) {
    return {
      body,
      id: [this.canvas.id, id].join('/'),
      motivation,
      target: target ? `${this.canvas.id}#xywh=${target}` : this.canvas.id,
      type: 'Annotation'
    }
  }

  /**
   * @todo handle text annotations
   * @todo handle annotations with target region
   */
  createAnnotationBody({ format, info, label, src, url }) {
    const { ext } = path.parse(src)
    return {
      format,
      height: this.canvas.height,
      id: url,
      label: { en: [label] },
      type: 'Image',
      service: info && [
        {
          '@context': 'http://iiif.io/api/image/3/context.json',
          id: info,
          extraFormats: ['png'],
          preferredFormats: ['png'],
          type: 'ImageService3',
          profile: 'level0',
          protocol: "http://iiif.io/api/image"
        }
      ],
      width: this.canvas.width
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
