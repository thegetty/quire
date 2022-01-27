/**
 * @param  {Object} context
 */
module.exports = function({ eleventyConfig, globalData, page }) {
  const { publication } = globalData
  const citationChicagoPublication = eleventyConfig.getFilter('citationChicagoPublication')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  
  return `
    ${citationChicagoPublicationContributors()}. <em>${pageTitle(page)}</em> ${citationChicagoPublication()}
  ` 
}
