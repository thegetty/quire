/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig, params) {
  const { config, page, publication } = params
  const citationChicagoPublication = eleventyConfig.getFilter('citationChicagoPublication')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  
  return [
    `${citationChicagoPublicationContributors({ contributors: publication.contributor })}.`,
    `<em>${pageTitle({ config, page })}</em>`,
    `${citationChicagoPublication({ publication })}`
  ].join(' ')
}
