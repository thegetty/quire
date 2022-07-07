/**
 * Nota bene:
 * Separate sort functions for different content types is not ideal,
 * however Quire requires that data could be defined globally, per-page, or per-shortcode.
 * As a result the logic to define the sort key and sort must be performed at the shortcode-level.
 *
 * @param  {Array} items References
 * @return {Array} sorted references
 */
module.exports = function (eleventyConfig, items) {
  if (!items || !Array.isArray(items)) return null

  const removeMarkdown = eleventyConfig.getFilter('removeMarkdown')

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#locales
   * @todo set locale using publication `config.languageCode`
   */
  const locales = 'en'

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options
   */
  const options = {
    caseFirst: 'upper',
    ignorePunctuation: false,
    localeMatcher: 'best fit',
    numeric: true,
    sensitivity: 'variant',
    usage: 'sort'
  }

  return items.sort((itemA, itemB) => {
    const sortById = eleventyConfig.globalData.config.params.displayBiblioShort
    let a = sortById ? itemA.id : itemA.sort_as || itemA.full
    let b = sortById ? itemB.id : itemB.sort_as || itemB.full
    a = removeMarkdown(a)
    b = removeMarkdown(b)
    return a.localeCompare(b, locales, options)
  })
}
