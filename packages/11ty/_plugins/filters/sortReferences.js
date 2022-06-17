/**
 * Nota bene:
 * Separate sort functions for different content types is not ideal,
 * however Quire requires that data could be defined globally, per-page, or per-shortcode.
 * As a result the logic to define the sort key and sort must be performed at the shortcode-level.
 *
 * @param  {Array} items References
 * @return {Array} sorted references
 */
module.exports = function (items) {
  if (!items || !Array.isArray(items)) return null

  return items.sort((a, b) => {
    const sortA = a.sort_as || a.full
    const sortB = b.sort_as || b.full

    switch (true) {
      case (sortA < sortB):
        return -1
      case (sortA > sortB):
        return 1
      default:
        return 0
    }
  })
}
