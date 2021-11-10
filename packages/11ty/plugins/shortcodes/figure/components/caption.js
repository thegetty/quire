const { oneLine } = require('common-tags')

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
module.exports = function(eleventyConfig, { config }, figure, content='') {
  const { caption, credit, id, label, src } = figure
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')

  return oneLine`
    <figcaption class="q-figure__caption">
      ${content}
      <span class="q-figure__caption-content">${markdownify(caption || '')}</span>
      <span class="q-figure__credit">${markdownify(credit || '')}</span>
    </figcaption>
  `
}
