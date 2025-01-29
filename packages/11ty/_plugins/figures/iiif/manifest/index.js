import { IIIFBuilder } from 'iiif-builder'
import { globalVault } from '@iiif/vault'
import CanvasBuilder from './canvas-builder.js'
import SequenceBuilder from './sequence-builder.js'
import Writer from './writer.js'
import chalkFactory from '#lib/chalk/index.js'
import path from 'node:path'

const logger = chalkFactory('Figures:IIIF:Manifest', 'DEBUG')

const vault = globalVault()
const builder = new IIIFBuilder(vault)

/**
 * Create a IIIF manifest from a Figure instance
 */
export default class Manifest {
  constructor (figure) {
    const { iiifConfig } = figure
    const { locale } = iiifConfig
    this.figure = figure
    this.locale = locale
    this.writer = new Writer(iiifConfig)
  }

  get annotations () {
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

  get choices () {
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
        type: 'Choice'
      },
      id: 'choices',
      motivation: 'painting'
    })
  }

  get sequenceItems () {
    if (!this.figure.sequences || !this.figure.sequences.length) return
    return this
      .figure.sequences
      .flatMap(({ items }) => items)
      .map((item) => {
        const canvasId = path.join(this.figure.canvasId, item.id)
        const sequenceItemImage = ({ format, info, label, src, uri }) => {
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
        return {
          body: sequenceItemImage(item),
          id: path.join(canvasId, 'annotation-page', item.id),
          motivation: 'painting',
          target: canvasId,
          type: 'Annotation'
        }
      })
  }

  createAnnotation (data) {
    const { body, id, motivation, region } = data
    return {
      body: body || this.createAnnotationBody(data),
      id: [this.figure.canvasId, id].join('/'),
      motivation,
      target: region ? `${this.figure.canvasId}#xywh=${region}` : this.figure.canvasId,
      type: 'Annotation'
    }
  }

  /**
   * @todo handle text annotations
   * @todo handle annotations with target region
   */
  createAnnotationBody ({ format, info, label, uri }) {
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
  async toJSON () {
    const manifest = builder.createManifest(this.figure.manifestId, (manifest) => {
      if (this.figure.isSequence) {
        manifest.addBehavior(['continuous', 'sequence'])
      }
      manifest.addLabel(this.figure.label, this.locale)
      CanvasBuilder.create(manifest, {
        annotations: this.annotations,
        choices: this.choices,
        figure: this.figure,
        sequenceItems: this.sequenceItems
      })
    })
    try {
      const manifestObject = builder.toPresentation3(manifest)
      return SequenceBuilder.create(manifestObject, {
        figure: this.figure,
        sequenceItems: this.sequenceItems
      })
    } catch (error) {
      throw new Error(`Failed to generate manifest: ${error}`)
    }
  }

  async write () {
    try {
      const json = await this.toJSON()
      logger.info(`Generated manifest for figure "${this.figure.id}"`)
      return await this.writer.write(json)
    } catch (error) {
      return { errors: [error] }
    }
  }
}
