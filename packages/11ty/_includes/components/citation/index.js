/**
 * Template for the "Cite this Page" feature. Called as a
    shortcode, such as:

    {% "citation", type: "chicago", range: "page" %}

    Can accept "chicago" or "mla" as a type

    Can accept "page" or "site" as a range

    Follows standard of using "et al" for more than ten
    authors in Chicago citations, and more than two authors
    in MLA citations.

 * @param  {[type]} eleventyConfig [description]
 * @param  {[type]} globalData     [description]
 * @param  {[type]} data           [description]
 * @return {[type]}                [description]
 */

module.exports = function(eleventyConfig, globalData, { type, range, page }) {
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
      page: citationChicagoPage(page),
      site: citationChicagoSite(page)
    },
    mla: {
      page: citationMLAPage(page),
      site: citationMLASite(page)
    }
  }

  return shortcodes[type][range]
}