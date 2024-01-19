const { html } = require('~lib/common-tags')

/**
 * Renders a table into the document with a captionn
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  Content of referenced table file and a caption
 */
module.exports = function(eleventyConfig) {
  const tableElement = eleventyConfig.getFilter('figureTableElement')
  const markdownify = eleventyConfig.getFilter('markdownify')

  return async function({ caption='', id, src }) {
    const table = await tableElement({ src })
    const title = markdownify(caption)

    return html`
      <a
        class="q-figure__modal-link"
        href="#${id}"
        title="${title}"
      >${table}</a>
    `
  }
}
