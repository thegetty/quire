const path = require('path')
const { html } = require('~lib/common-tags')

/**
 * lightboxData
 * @parameter data Object - Figures data to insert
 *
 * @returns An HTML Script Element with the JSON-serialized payload
 */
module.exports = function(eleventyConfig) {

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
        label,
        media_type,
        src,
      } = fig

      let mapped = { ...fig, slugged_id: slugify(id) }

      if (label) {
        mapped.label_html = markdownify(label) 
      }

      if (caption) {
        mapped.caption_html = markdownify(caption)
      }

      if (credit) {
        mapped.credit_html = markdownify(caption)
      }

      switch (media_type) {
        case 'table': {
          // Load the linked HTML file for table figures
          let htmlFilePath = path.join(eleventyConfig.dir.input, assetDir, src)
          mapped.src_content = await renderFile(htmlFilePath) 
          return mapped
        }
        default: 
          return mapped
      }
    }))


    const jsonData = JSON.stringify(figures)

    return html`<script type="application/json" 
                    class="quire-data" 
                    id="page-figures">
                      ${jsonData}
                    </script>`
  }
}
