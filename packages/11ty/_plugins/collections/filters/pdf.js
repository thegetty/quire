import outputFilter from './output.js'
/**
 * Returns `true` if page should be built for pdf output
 * @param  {Object} page Eleventy page object
 * @return {Boolean}
 */
export default function (page) {
  return outputFilter('pdf', page)
}
