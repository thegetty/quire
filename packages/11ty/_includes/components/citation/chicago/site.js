/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig) {
  const citationChicagoPublication = eleventyConfig.getFilter('citationChicagoPublication')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const { config, publication } = eleventyConfig.globalData
  const pageTitle = eleventyConfig.getFilter('pageTitle')

  return function (params) {
    const { page } = params
    const { subtitle, title } = page
    return [
      `${citationChicagoPublicationContributors({ contributors: publication.contributor })}.`,
      `<em>${pageTitle({ subtitle, title })}</em>`,
      `${citationChicagoPublication({ publication })}`
    ].join(' ')
  }
}
