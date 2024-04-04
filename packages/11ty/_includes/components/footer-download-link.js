const path = require('path')

const { oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const checkFormat = require('../../_plugins/collections/filters/output.js')

const logger = chalkFactory("shortcode:footer-dl")
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

  /**
   * @function checkFooterPagePDF
   * 
   * @param {Object} config pdf object from Quire config
   * @param {Array<string>,string,undefined} outputs outputs setting from page frontmatter 
   * @param {bool} frontmatterSetting pdf page setting from page frontmatter
   * 
   **/
  const checkFooterPagePDF = (config,outputs,frontmatterSetting) => {

    // Is the output being created?
    if ( !checkFormat('pdf',{data:{outputs}}) ) { 
      return false 
    }

    // Are the footer links set?
    if ( config.pagePDF.accessLinks.find( (al) => al.footer === true ) === undefined )  {
      return false
    }

    // Return the core logic check
    return ( config.pagePDF.output === true && frontmatterSetting !== false ) || frontmatterSetting === true

  }

  return function (params) {
    const { key, outputs, page_pdf_output: pagePDFOutput } = params

    if (!checkFooterPagePDF(pdfConfig,outputs,pagePDFOutput)) { 
      return ''
    }

    const text = pdfConfig.pagePDF.accessLinks.find( al => al.footer === true ).label
    const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(key)}.pdf` )

    return oneLine`
      <div class="quire-download" data-outputs-exclude="epub,pdf">
        <a class="quire-download__link" href="${ href }" target="_blank" ><span>${ text }</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
      </div>`
  }

}
