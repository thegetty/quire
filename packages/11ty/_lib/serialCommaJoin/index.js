/**
 * Joins an array of strings via serial comma -- https://en.wikipedia.org/wiki/Serial_comma
 *
 * @param {Array<string>} elements
 **/

export default (elements) => {
  const last = `and ${elements.at(-1)}`
  switch (elements.length) {
    case 0:
      return ''
    case 1:
      return elements.at(0)
    case 2:
      return elements.at(0) + ' ' + last
    default:
      return elements.slice(0, -1).concat([last]).join(', ')
  }
}
