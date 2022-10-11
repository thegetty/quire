const chalkFactory = require('~lib/chalk')
const { oneLine } = require('~lib/common-tags')
const logger = chalkFactory(`Shortcodes:Annoref`)
/**
 * Annoref Shortcode
 * Link to the annotation or region state of a canvas
 *
 * @param      {Object} params
 * @property   {String} anno Comma-separated list of annotation ids
 * @property   {String} fig Figure ID
 * @property   {String} region Comma-separated, with format "x,y,width,height"
 * @property   {String} text Link text
 * 
 * @return     {String}  Anchor tag with link text annotation and region data attributes
 */
module.exports = function (eleventyConfig) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  return ({ anno='', fig, region='', text='' }) => {
    const annoIds = anno.split(',').map((id) => id.trim())
    return oneLine`
      <a 
        class="annoref"
        data-annotation-ids="${annoIds.join(',')}"
        data-figure-id="${fig}"
        data-region="${region}"
      >${markdownify(text)}</a>
    `
  }
}
