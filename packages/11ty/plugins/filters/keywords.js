/**
 * Gets the array of subject keywords defined in the publication data file
 *
 * @return {Array} An array of keyword strings
 */
module.exports = function(eleventyConfig, { publication }) {
  if (!publication.subject) {
    console.warn(`Error: the 'subject' key is not defined in the 'publication' data file`)
    return ''
  }

  return publication.subject
    .filter(({ type }) => type === 'keyword')
    .map(({ name }) => name)
}
