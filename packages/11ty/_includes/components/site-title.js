/**
 * Concatenates the site title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also page/title.liquid
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} globalData
 * 
 * @return  {String} Site title
 */
module.exports = function(eleventyConfig, globalData) {
  const { publication } = globalData
  const { reading_line: readingLine, subtitle, title } = publication
  return function() {
    const lastLetter = title.slice(-1)
    const endPunctuation = '!?'.includes(lastLetter) ? '' : ':'
    let siteTitle = `${title}`
    if (subtitle) siteTitle += `${endPunctuation} ${subtitle}`
    if (readingLine) siteTitle += ` ${readingLine}`
    return siteTitle
  }
}
