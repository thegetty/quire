import outputFilter from './output.js'

/**
 * Returns `true` if page should be included in the pagination
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
export default function (page) {
  return outputFilter('html', page) && page.data.type !== 'data'
}
