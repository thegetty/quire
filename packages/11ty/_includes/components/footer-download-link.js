const path = require('path')

const { oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const logger = chalkFactory("shortcode:footer-dl")
/**
 * Renders a link
 *
 * @param  {Object} link
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
    const { page_pdf_output: pagePDFOutput, key: pageKey } = params

    if (pdfConfig.pagePDF.output !== true && pagePDFOutput !== true) {
      return ''
    }

    if ( pdfConfig.pagePDF.accessLinks.find( (al) => al.footer === true ) === undefined )  {
      return ''
    }

    const text = pdfConfig.pagePDF.accessLinks.find( al => al.footer === true ).label
    const href = path.join( pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(pageKey)}.pdf` )

    return oneLine`
      <div class="quire-download">
        <a class="quire-download__link" href="${ href }" target="_blank" ><span>${ text }</span><svg class="quire-download__link__icon"><use xlink:href="#download-icon"></use></svg></a>
      </div>`
  }

}
