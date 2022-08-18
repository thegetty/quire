const mime = require('mime-types')
const path = require('path')
const titleCase = require('~plugins/filters/titleCase')

module.exports = class Choices {
  constructor({ canvas, eleventyConfig, figure, items }) {
    this.id = [canvas.id, 'choices'].join('/')
    this.config = eleventyConfig.globalData.config
    this.items = items.map((item) => new Annotation({ eleventyConfig, figure, item }))
    this.type = 'Annotation'
    this.motivation = 'painting'
    this.iiifConfig = eleventyConfig.globalData.iiifConfig
  }

  get body (data) {
    const items = this.items.map(({ label, src }) => {
      const name = path.parse(src).name
      const choiceId = new URL([this.imageDir, src].join('/'), process.env.URL).href
      const format = mime.lookup(src)
      const choice = {
        id: choiceId,
        format,
        height,
        type: 'Image',
        label: { en: [label] },
        width
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


  createAnnotation() {
    return {
      body: this.body,
      id: this.id,
      motivation: this.motivation,
      type: this.type
    }
  }
}
