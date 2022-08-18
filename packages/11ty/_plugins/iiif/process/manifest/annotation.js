const path = require('path')
const titleCase = require('~plugins/filters/titleCase')

module.exports = class Annotation {
  constructor({ annotation, canvas, eleventyConfig, figure }) {
    this.id = annotation.id
    this.src = annotation.src
    this.type = 'Annotation'
    this.motivation = annotation.src ? 'painting' : 'text'
  }

  get body (data) {
    const items = annotations.map(({ label, src }) => {
      const name = path.parse(src).name
      const choiceId = new URL([imageDir, src].join('/'), process.env.URL).href
      const format = mime.lookup(src)
      const choice = {
        id: choiceId,
        format,
        height,
        type: 'Image',
        label: { en: [label] },
        width
      }
      if (preset === 'zoom') {
        const serviceId = new URL([outputDir, name, imageServiceDirectory].join('/'), process.env.URL)
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

  get filename(data) {
    if (!data.src) return
    return path.parse(data.src).name
  }

  get label(data) {
    return data.label || titleCase(this.filename)
  }

  create() {
    return {
      body: this.body,
      id: this.id,
      motivation: this.motivation,
      type: this.type
    }
  }
}
