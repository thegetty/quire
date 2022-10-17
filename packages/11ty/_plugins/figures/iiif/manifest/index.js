const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const titleCase = require('~plugins/filters/titleCase')
const Writer = require('./writer')
const { globalVault } = require('@iiif/vault')
const { IIIFBuilder } = require('iiif-builder')
const { error, info } = chalkFactory('Figure Processing:IIIF:Manifest')

const vault = globalVault()
const builder = new IIIFBuilder(vault)

/**
 * Create a IIIF manifest from a Figure instance
 */
module.exports = class Manifest {
  constructor(figure) {
    const { iiifConfig } = figure
    const { baseURL, dirs, locale, manifestFilename } = iiifConfig
    this.figure = figure
    this.inputDir = path.join(dirs.inputRoot, dirs.input)
    this.locale = locale
    this.writer = new Writer(iiifConfig)
  }

  get annotations() {
    const annotations = this.figure.annotations
      .flatMap(({ items }) => items)
      .filter(({ type }) => type === 'annotation')
      .map((item) => this.createAnnotation(item))
      /**
       * Add the "base" image as a canvas annotation
       */
      if (this.figure.baseImageAnnotation) { 
        annotations.unshift(this.createAnnotation(this.figure.baseImageAnnotation))
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
    const fullImagePath = path.join(this.inputDir, this.canvasImagePath)
    const { height, width } = await sharp(fullImagePath).metadata()
    this.canvasHeight = height
    this.canvasWidth = width
    return { height, width }
  }

  createAnnotation(data) {
    const { body, id, motivation, target } = data
    return {
      body: body || this.createAnnotationBody(data),
      id: [this.figure.canvasId, id].join('/'),
      motivation,
      target: target ? `${this.figure.canvasId}#xywh=${target}` : this.figure.canvasId,
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
      height: this.canvasHeight,
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
          protocol: 'http://iiif.io/api/image'
        }
      ],
      width: this.canvasWidth
    }
  }

  /**
   * Uses `builder` to create the JSON representation of the manifest
   * @return {JSON}
   */
  async toJSON() {
    const { height, width } = await this.calcCanvasDimensions()
    const manifest = builder.createManifest(this.figure.manifestId, (manifest) => {
      manifest.addLabel(this.figure.label, this.locale)
      manifest.createCanvas(this.figure.canvasId, (canvas) => {
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
      this.json = builder.toPresentation3(manifest)
      info(`Generated manifest for figure "${this.figure.id}"`)
      return { success: true }
    } catch(errorMessage) {
      return { errors: [`Failed to generate manifest: ${errorMessage}`]}
    }
  }

  async write() {
    return await this.writer.write(this.json)
  }
}
