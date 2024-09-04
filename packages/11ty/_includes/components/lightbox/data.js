const path = require('path')
const { html } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  
  /**
   * lightboxData
   * @parameter data Object - Figures data to insert
   *
   * Returns an HTML script element with the JSON-serialized payload
   *
   * */

  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureAudioElement = eleventyConfig.getFilter('figureAudioElement')
  const figureTableElement = eleventyConfig.getFilter('figureTableElement')
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')

  const markdownify = eleventyConfig.getFilter('markdownify')
  const renderFile = eleventyConfig.getFilter('renderFile')
  const slugify = eleventyConfig.getFilter('slugify')
  
  const { assetDir } = eleventyConfig.globalData.config.figures

  return async function(...args) {

    const [data] = args

    const figures = await Promise.all(data.map( async (fig) => {

      const {
        caption,
        credit,
        id,
        isSequence,
        label,
        mediaType,
        src,
      } = fig

      let mapped = { ...fig, slugged_id: slugify(id) }

      if (label) {
        mapped.labelHtml = markdownify(label) 
      }

      if (caption) {
        mapped.captionHtml = markdownify(caption)
      }

      if (credit) {
        mapped.creditHtml = markdownify(caption)
      }

      if (!isSequence) {
        mapped.annotationsElementContent = annotationsUI({ figure: fig, lightbox: true })
      }

      const isAudio = mediaType === 'soundcloud'
      const isVideo = mediaType === 'video' || mediaType === 'vimeo' || mediaType === 'youtube'

      const figureElement = async (figure) => {
        switch (true) {
          case mediaType === 'soundcloud':
            return figureAudioElement(figure)
          case mediaType === 'table':
            return `<div class="overflow-container">${await figureTableElement(figure)}</div>`
          case isVideo:
            return figureVideoElement(figure)
          case mediaType === 'image':
          default:
            return figureImageElement(figure, { preset: 'zoom', interactive: true })
        }
      }

      mapped.figureElementContent = await figureElement(fig)
      return mapped
    }))


    const jsonData = JSON.stringify(figures)

    return html`<script type="application/json" 
                    class="q-lightbox-data"
                    slot="data">
                      ${jsonData}
                    </script>`
  }
}
