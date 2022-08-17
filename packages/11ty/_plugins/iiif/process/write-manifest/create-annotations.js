const mime = require('mime-types')
const path = require('path')

module.exports = function (eleventyConfig, figure) {
  const { imageDir } = eleventyConfig.globalData.config.params
  const { annotations, preset } = figure

  return function (canvas, annotationSet) {
    const annotations = annotationSet.items
    const { height, width } = canvas.entity

    if (Array.isArray(annotations)) {
      const bodyItems = annotations.map(({ label, src }) => {
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
      const annotationId = [canvas.id, 'annotation'].join('/')
      canvas.createAnnotation(annotationId, {
        id: annotationId,
        type: 'Annotation',
        motivation: 'painting',
        body: {
          type: 'Choice',
          items: bodyItems
        }
      })
    }
  }
}
