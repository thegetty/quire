const mime = require('mime-types')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')
const AnnotationBase = require('./annotation-base')

module.exports = class Choices extends AnnotationBase {
  constructor(iiifConfig, canvas, items) {
    super(iiifConfig, canvas)

    this.id = [this.getBaseId(this.figure.id), 'choices'].join('/')
    this.items = items
    this.motivation = 'painting'
  }

  get body() {
    if (!this.items) return
    const items = this.items.map((item) => {
      const { src } = item
      const label = this.getLabel(item)
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
    return {
      type: 'Choice',
      items
    }
  }
}
