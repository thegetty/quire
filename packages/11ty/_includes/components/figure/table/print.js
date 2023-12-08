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

  return async function({ src }) {
    const table = await tableElement({ src })

    return html`
      ${table}
    `
  }
}
