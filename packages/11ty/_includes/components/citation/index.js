/**
 * Generates a citation for the context (page or publication)
 * 
 * @return {String}                citation
 */
module.exports = function (eleventyConfig) {
  const citePage = eleventyConfig.getFilter('citePage')
  const citePublication = eleventyConfig.getFilter('citePublication')
  const formatCitation = eleventyConfig.getFilter('formatCitation')

  return function (params) {
    const { context } = params

    let item
    switch (context) {
      case 'page':
        item = citePage(params)
        break
      case 'publication':
        item = citePublication(params)
        break
      default:
        break
    }

    return formatCitation(item, params)
  }
}
