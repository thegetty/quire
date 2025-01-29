import outputFilter from './output.js'

/**
 * Returns `true` if page should be included in the menu
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
export default function (page) {
  const { menu, type } = page.data
  return (outputFilter('html', page) || menu === true) && menu !== false && type !== 'data'
}
