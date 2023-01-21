const jsdom = require('jsdom')

const { JSDOM } = jsdom

/**
 * Slugify all ids in a DOM
 *
 * @param   {Object}   element HTML element
 * @param   {Function} slugifyFn Function to slugify ids strings
 */
module.exports = (content, eleventyConfig) => {
  const dom = new JSDOM(content)
  const { document } = dom.window
  const slugify = eleventyConfig.getFilter('slugify')

  Array
    .from(document.querySelectorAll('[id]'))
    .forEach((element) => {
      element.id = slugify(element.id)
    })

  return dom.serialize()
}
