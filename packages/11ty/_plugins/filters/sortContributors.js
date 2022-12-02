/**
 * Nota bene:
 * Separate sort functions for different content types is not ideal,
 * however Quire requires that data could be defined globally, per-page, or per-shortcode.
 * As a result the logic to define the sort key and sort must be performed at the shortcode-level.
 * 
 * @param  {Object} eleventyConfig
 * @param  {Array} contributors
 * @return {Object}                object
 */
module.exports = function(eleventyConfig, contributors) {
  const fullname = eleventyConfig.getFilter('fullname')
  return contributors
    .map((item) => {
      item.sort_as ??= fullname(item, { reverse: true })
      return item
    })
    .sort((a, b) => {
      return a.sort_as && b.sort_as && a.sort_as.localeCompare(b.sort_as)
    })
}
