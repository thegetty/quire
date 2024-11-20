/**
 * Slugify all ids in a DOM
 *
 * @param   {Object}   HTML Document element
 * @param   {Function} slugifyFn Function to slugify ids strings
 */
module.exports = (documentElement, eleventyConfig) => {
  const slugify = eleventyConfig.getFilter('slugify')

  Array
    .from(documentElement.querySelectorAll('[id]'))
    .forEach((element) => {
      element.id = slugify(element.id)
    })
}
