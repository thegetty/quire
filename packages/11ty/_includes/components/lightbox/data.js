const path = require('path')
const { html } = require('~lib/common-tags')

/**
 * Quire lightboxData component
 * @param {Object} eleventyConfig
 * @return {Function} 11ty component function for lightboxData
 * 
 * Serializes the data for a lightbox's figures to a slotted
 * `<script>` tag. Where necessary it uses 11ty / quire functions
 * to generate HTML markup and slugified resource IDs.
 */
module.exports = function(eleventyConfig) {

  const annotationsUI = eleventyConfig.getFilter('annotationsUI')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureAudioElement = eleventyConfig.getFilter('figureAudioElement')
  const figureTableElement = eleventyConfig.getFilter('figureTableElement')
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const renderFile = eleventyConfig.getFilter('renderFile')
  const slugify = eleventyConfig.getFilter('slugify')
  
  const { assetDir } = eleventyConfig.globalData.config.figures

  /**
   * lightboxData shortcode component function
   * @param {Object} data - Figures data to insert
   * @return an HTML script element with JSON-serialized payload
   */
  return async function(data) {

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

      const annotationsElementContent = !isSequence ? annotationsUI({ figure: fig, lightbox: true }) : undefined
      const labelHtml = label ? markdownify(label) : undefined 
      const captionHtml = caption ? markdownify(caption) : undefined
      const creditHtml = credit ? markdownify(caption) : undefined
      const sluggedId = slugify(id)

      let mapped = { ...fig, 
        annotationsElementContent,
        captionHtml, 
        creditHtml,                     
        labelHtml, 
        sluggedId, 
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

    return html`
      <script type="application/json" class="q-lightbox-data" slot="data">
        ${jsonData}
      </script>`
  }
}
