/**
 * Prevent duplicate ids from rendering in output
 * appends an incrementing digit (e.g. '_1', '_2', etc.)  to each duplicate id
 * @TODO this should definitely be tested!
 *
 * @param  {Object} element HTML element
 */
module.exports = function (element, output) {
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
