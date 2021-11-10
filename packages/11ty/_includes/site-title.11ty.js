/**
 * Concatenates the site title and subtitle, using a colon, or if the title ends with a ! or ?, no colon is included.
 * See also page/title.liquid
 */

module.exports = function({ publication }) {
  const { reading_line: readingLine, subtitle, title } = publication
  const lastLetter = title.slice(-1)
  const endPunctuation = '!?'.includes(lastLetter)
    ? ''
    : ':'
  let siteTitle = `${title}${endPunctuation}`
  if (subtitle) siteTitle += ` ${subtitle}`
  if (readingLine) siteTitle += ` ${readingLine}`
  return siteTitle
}
