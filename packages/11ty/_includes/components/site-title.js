/**
 * Concatenates the site title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also page/title.liquid
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} data
 * 
 * @return  {String} Site title
 */
module.exports = function(eleventyConfig, data) {
  const { publication } = data
  const { reading_line: readingLine, subtitle, title } = publication
  const lastLetter = title.slice(-1)
  const endPunctuation = '!?'.includes(lastLetter) ? '' : ':'
  let siteTitle = `${title}`
  if (subtitle) siteTitle += `${endPunctuation} ${subtitle}`
  if (readingLine) siteTitle += ` ${readingLine}`
  return siteTitle
}
