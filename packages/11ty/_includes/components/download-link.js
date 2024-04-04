const path = require('path')

const { oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

/**
 * Handles logic about whether a footer d/l link appears at all and renders a link
 *
 * @param  {String} key 11ty page.key data
 * @param  {String} outputs
 * @property  {String} link_relation The value of the anchor tag 'rel' property
 * @property  {String} media_type The value of the anchor tag 'type' property
 * @property  {String} name The link text
 * @property  {String} url
 * @param  {Array<String>} classes
 * @return {String}                anchor tag
 */
module.exports = function(eleventyConfig) {
  
  const slugify = eleventyConfig.getFilter('slugify')

  const pdfConfig = eleventyConfig.globalData.config.pdf

  return function (params) {
    const { key, label } = params

    const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(key)}.pdf` )

    return oneLine`
      <div class="quire-download" data-outputs-exclude="epub,pdf">
        <a class="quire-download__link" href="${ href }" target="_blank" ><span>${ label }</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
      </div>`
  }

}
