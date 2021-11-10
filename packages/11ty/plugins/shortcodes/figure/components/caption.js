const { html } = require('common-tags')

/**
 * Figure caption and credit
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {String} data   Caption and credit content to render
 * @property   {String} data.caption
 * @property   {String} data.credit
 * @property   {String} data.label  Used for the link to open the modal and for epub output when `figureLabelPosition` === 'below'
 * @property   {String} data.link   URL used to open the figure modal element
 * @return     {String}  An HTML <figcaption> element
 */
module.exports = function(eleventyConfig, { config }, { caption, credit, id, label, src }) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')
  const slugify = eleventyConfig.getFilter('slugify')

  const labelElement = qfigurelabel({ caption, id, label, src })

  return html`
    <figcaption class="q-figure__caption">
      ${labelElement}
      <span class="q-figure__caption-content">${caption && markdownify(caption)}</span>
      <span class="q-figure__credit">${credit && markdownify(credit)}</span>
    </figcaption>
  `
}
