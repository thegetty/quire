const { oneLine } = require('common-tags')

/**
 * Figure caption and credit
 * @param      {Object} eleventyConfig  eleventy configuration
 * @param      {Object} globalData
 * 
 * @param      {Object} params
 * @property   {String} figure
 * @property   {String} content
 * @return     {String}  An HTML <figcaption> element
 */
module.exports = function(eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')

  return function({ figure, content='' }) {
    const { caption, credit } = figure

    return oneLine`
      <figcaption class="q-figure__caption">
        ${markdownify(content)}
        <span class="q-figure__caption-content">${markdownify(caption || '')}</span>
        <span class="q-figure__credit">${markdownify(credit || '')}</span>
      </figcaption>
    `
  }
}
