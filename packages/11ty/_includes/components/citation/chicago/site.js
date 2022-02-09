/**
 * @param  {Object} context
 */
module.exports = function(eleventyConfig, data) {
  const { publication } = data
  const citationChicagoPublication = eleventyConfig.getFilter('citationChicagoPublication')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  
  return `
    ${citationChicagoPublicationContributors()}. <em>${pageTitle(data, page)}</em> ${citationChicagoPublication()}
  ` 
}
