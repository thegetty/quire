const { oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const checkFormat = require('../../_plugins/collections/filters/output.js')
const path = require('path')

const logger = chalkFactory('shortcode:footer-dl')

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
 *
 * @return {String}  anchor tag
 */
module.exports = function(eleventyConfig) {
  const slugify = eleventyConfig.getFilter('slugify')
  const pdfConfig = eleventyConfig.globalData.config.pdf

  /**
   * @function checkLinkPagePDF
   * 
   * @param {Object} config pdf object from Quire config
   * @param {Array<string>,string,undefined} outputs outputs setting from page frontmatter 
   * @param {bool} frontmatterSetting pdf page setting from page frontmatter
   * 
   * Returns true if a download link of this kind is configured
   */
  const checkLinkPagePDF = (type, config, outputs, frontmatterSetting) => {
    // Is the output being created?
    if ( !checkFormat('pdf', { data: { outputs } })) {
      return false 
    }

    // Are the links of this type set?
    if (config.pagePDF.accessLinks.find((al) => al[type] === true) === undefined)  {
      return false
    }

    // Return the core logic check
    return (config.pagePDF.output === true && frontmatterSetting !== false) || frontmatterSetting === true
  }

  return function (params) {
    const { key, outputs, page_pdf_output: pagePDFOutput, type } = params

    if (!checkLinkPagePDF(type, pdfConfig, outputs, pagePDFOutput)) {
      return ''
    }

    const text = pdfConfig.pagePDF.accessLinks.find((al) => al[type] === true).label
    const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(key)}.pdf` )

    return oneLine`
      <div class="quire-download ${ type==='footer' ? 'quire-download-footer-link' : '' }" data-outputs-exclude="epub,pdf">
        <a class="quire-download__link" href="${href}" download><span>${text}</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
      </div>
    `
  }
}
