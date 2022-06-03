/**
 * Generates a citation for the context (page or publication)
 * 
 * @return {String}                citation
 */
module.exports = function (eleventyConfig) {
  const citationStylesLibPage = eleventyConfig.getFilter("citationStylesLibPage")
  const citationStylesLibPublication = eleventyConfig.getFilter("citationStylesLibPublication")
  const formatCitation = eleventyConfig.getFilter("formatCitation")

  return function (params) {
    const { context } = params

    let item
    switch (context) {
      case "page":
        item = citationStylesLibPage(params)
        break
      case "publication":
        item = citationStylesLibPublication(params)
        break
      default:
        break
    }

    return formatCitation(item, params)
  }
}
