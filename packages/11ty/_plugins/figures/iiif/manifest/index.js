const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')
const Writer = require('./writer')
const { globalVault } = require('@iiif/vault')
const { IIIFBuilder } = require('iiif-builder')

const logger = chalkFactory('Figures:IIIF:Manifest', 'DEBUG')

const vault = globalVault()
const builder = new IIIFBuilder(vault)

/**
 * Create a IIIF manifest from a Figure instance
 */
module.exports = class Manifest {
  constructor(figure) {
    const { iiifConfig } = figure
    const { locale } = iiifConfig
    this.figure = figure
    this.locale = locale
    this.writer = new Writer(iiifConfig)
  }

  get annotations() {
    const annotations = []
    /**
     * Add the "base" image as a canvas annotation
     */
    if (this.figure.baseImageAnnotation) {
      annotations.push(this.createAnnotation(this.figure.baseImageAnnotation))
    }
    if (this.figure.annotations) {
      annotations.push(...this.figure.annotations
        .flatMap(({ items }) => items)
        .filter(({ type }) => type === 'annotation')
        .map((item) => this.createAnnotation(item)))
    }
    return annotations
  }

  get choices() {
    if (!this.figure.annotations) return
    const choices = this.figure.annotations
      .flatMap(({ items }) => items)
      .filter(({ type }) => type === 'choice')

    if (!choices.length) return

    const items = choices.map((item) => {
      if (!item.src) {
        logger.error(`Invalid annotation on figure ID "${this.figure.id}". Annotations must have a "src" or "text" property`)
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
  createAnnotationBody({ format, info, label, src, uri }) {
    const { ext } = path.parse(src)
    return {
      format,
      height: this.figure.canvasHeight,
      id: uri,
      label: { en: [label] },
      type: 'Image',
      service: info && [
        {
          '@context': 'http://iiif.io/api/image/2/context.json',
          '@id': info,
          profile: 'level0',
          protocol: 'http://iiif.io/api/image'
        }
      ],
      width: this.figure.canvasWidth
    }
  }

  /**
   * Uses `builder` to create the JSON representation of the manifest
   * @return {JSON}
   */
  async toJSON() {
    const manifest = builder.createManifest(this.figure.manifestId, (manifest) => {
      manifest.addLabel(this.figure.label, this.locale)
      manifest.createCanvas(this.figure.canvasId, (canvas) => {
        canvas.height = this.figure.canvasHeight
        canvas.width = this.figure.canvasWidth
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
      return builder.toPresentation3(manifest)
    } catch(error) {
      throw new Error(`Failed to generate manifest: ${error}`)
    }
  }

  async write() {
    try {
      const json = await this.toJSON()
      logger.info(`Generated manifest for figure "${this.figure.id}"`)
      return await this.writer.write(json)
    } catch(error) {
      return { errors: [error] }
    }
  }
}
