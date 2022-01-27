module.exports = function(eleventyConfig, { publication }, page) {
  const citationChicagoPublication = eleventyConfig.getFilter('citationChicagoPublication')
  const citationChicagoPublicationContributors = eleventyConfig.getFilter('citationChicagoPublicationContributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  
  return `
    ${citationChicagoPublicationContributors()}. <em>${pageTitle(page)}</em> ${citationChicagoPublication()}
  ` 
}
