const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * A shortcode for embedding a table into the document.
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const tableElement = eleventyConfig.getFilter('figureTableElement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return async function({ caption, credit, id, label, src }) {
    const table = await tableElement({ src })
    const title = markdownify(caption)

    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      <a
        class="q-figure__modal-link"
        href="#${id}"
        title="${title}"
      >
        ${table}
      </a>
      ${captionElement}
    `
  }
}
