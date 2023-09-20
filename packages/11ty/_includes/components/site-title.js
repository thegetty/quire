/**
 * Concatenates the site title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also page/title.liquid
 *
 * @param  {Object} eleventyConfig
 * 
 * @return  {String} Site title
 */
module.exports = function(eleventyConfig) {
  const { publication } = eleventyConfig.globalData
  const { reading_line: readingLine, subtitle, title } = publication
  return function() {
    const separator = '!?'.includes(title.slice(-1)) ? '' : ':'
    let siteTitle = `${title}`
    if (subtitle) siteTitle += `${separator}\u0020${subtitle}`
    if (readingLine) siteTitle += `\u0020(${readingLine})`
    return siteTitle
  }
}
