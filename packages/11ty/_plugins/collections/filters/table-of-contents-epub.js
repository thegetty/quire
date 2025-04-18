import outputFilter from './output.js'

/**
 * Returns `true` if page should be included in the EPUB build of the Table of Contents
 * @param  {Object} page Eleventy `page` object
 * @return {Boolean}
 */
export default function (page) {
  const { toc, type } = page.data
  return (outputFilter('epub', page) || toc === true) && toc !== false && type !== 'data'
}
