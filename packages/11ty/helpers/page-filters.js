/**
 * Returns `true` if page should be built
 * for the current output type defined in `env.QUIRE_OUTPUT`
 * @param  {Object} data Eleventy `page.data` object
 * @return {Boolean}
 */
const currentOutputFilter = function ({ outputs }) {
  return outputs !== 'none' &&
    outputs !== false &&
    (!outputs ||
      Array.isArray(outputs) && outputs.includes(process.env.QUIRE_OUTPUT) ||
      outputs === process.env.QUIRE_OUTPUT)
}

/**
 * Returns `true` if page should be included in the menu
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
const menuFilter = function(data) {
  const { menu, type } = data
  return (currentOutputFilter(data) || menu === true) && menu !== false && type !== 'data'
}

/**
 * Returns `true` if page should be included in the Table of Contents
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
const tableOfContentsFilter = function(data) {
  const { toc, type } = data
  return (currentOutputFilter(data) || toc === true) && toc !== false && type !== 'data'
}

module.exports = { currentOutputFilter, menuFilter, tableOfContentsFilter }
