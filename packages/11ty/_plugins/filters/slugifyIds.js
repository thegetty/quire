const jsdom = require('jsdom')

const { JSDOM } = jsdom

/**
 * Slugify all ids in a DOM
 *
 * @param   {Object}   element HTML element
 * @param   {Function} slugifyFn Function to slugify ids strings
 */
const slugifyElementIds = function(element, slugifyFn) {
  if (!slugifyFn) return

  Array
    .from(element.querySelectorAll('[id]'))
    .forEach((childElement) => {
      childElement.id = slugifyFn(childElement.id)
    })
}

/**
 * Prevent duplicate ids from rendering in output
 * appends an incrementing digit (e.g. '_1', '_2', etc.)  to each duplicate id
 * @TODO this should definitely be tested!
 *
 * @param   {Object} element HTML element
 */
const dedupeElementIds = function (element) {
  const elementIds = Array
    .from(element.querySelectorAll('[id]'))
    .map(({ id }) => id)

  let duplicateIds = elementIds.reduce((duplicates, id, index, array) => {
    if (array.indexOf(id) !== index && !duplicates.includes(id)) {
      duplicates.push(id)
    }

    return duplicates
  }, [])

  duplicateIds.forEach((id) => {
    const elementsWithSameId = Array.from(element.querySelectorAll(`[id=${id}]`))
    elementsWithSameId.forEach((element, index) => {
      if (index > 0) element.id += `_${index}`
    })
  })
}

module.exports = (content, eleventyConfig) => {
  const dom = new JSDOM(content)
  const { document } = dom.window
  const slugify = eleventyConfig.getFilter('slugify')

  slugifyElementIds(document, slugify)
  dedupeElementIds(document)

  return dom.serialize()
}
