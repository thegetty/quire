/**
 * Template for the "Cite this Page" feature. Called as a
 * shortcode, such as:
 *
 * {% "citation", type: "chicago", range: "page" %}
 *
 * Follows standard of using "et al" for more than ten
 * authors in Chicago citations, and more than two authors
 * in MLA citations.
 *
 * @param  {Object} context
 * @param  {Object} params
 * @property  {String} type - "chicago" or "mla"
 * @property  {String} range - "page" or "site"
 * 
 * @return {String}                citation markup
 */

module.exports = function(eleventyConfig, data) {
  const { type, range } = data;
  if (!type) {
    console.warn(`"type" is required for the citation shortcode. Options are: "chicago" or "mla"`)
    return ''
  }
  if (!range) {
    console.warn(`"range" is required for the citation shortcode. Options are: "page" or "site"`)
    return ''
  }

  const citationChicagoPage = eleventyConfig.getFilter('citationChicagoPage')
  const citationChicagoSite = eleventyConfig.getFilter('citationChicagoSite')
  const citationMLAPage = eleventyConfig.getFilter('citationMLAPage')
  const citationMLASite = eleventyConfig.getFilter('citationMLASite')

  const shortcodes = {
    chicago: {
      page: citationChicagoPage(),
      site: citationChicagoSite()
    },
    mla: {
      page: citationMLAPage(),
      site: citationMLASite()
    }
  }

  return shortcodes[type][range]
}
