/**
 * Generates a citation for the context (page or publication)
 * 
 * @return {String}                citation
 */
module.exports = function (eleventyConfig) {
  const citationStylesLibPage = eleventyConfig.getFilter("citationStylesLibPage")
  const citationStylesLibPublication = eleventyConfig.getFilter("citationStylesLibPublication")
  const createCitation = eleventyConfig.getFilter("createCitation")

  return function (params) {
    const { context } = params

    switch (context) {
      case "page":
        return createCitation(citationStylesLibPage, params)
        break
      case "publication":
        return createCitation(citationStylesLibPublication, params)
        break
      default:
        break
    }
  }
}
