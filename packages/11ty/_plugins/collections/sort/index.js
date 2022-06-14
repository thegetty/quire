/**
 * Sort method applied to pages in collections
 * @param {Object} a and b are page objects
 */
module.exports = (a, b) => {
  if (a.data.order === b.data.order) {
    console.warn(`Warning! "${a.inputPath}" and "${b.inputPath}" have identical values for "order" and may not sort as expected.`)
  }
  return a.data.order - b.data.order
}
