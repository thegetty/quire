import { html } from '#lib/common-tags/index.js'

/**
 * Renders a table into the document with a captionn
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  Content of referenced table file and a caption
 */
export default function (eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const tableElement = eleventyConfig.getFilter('figureTableElement')

  return async function ({ caption, credit, id, label, src }) {
    const table = await tableElement({ src })

    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      ${table}
      ${captionElement}
    `
  }
}
