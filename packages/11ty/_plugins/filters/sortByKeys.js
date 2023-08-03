/**
 * 
 * Sort comparator using the keys in the ordered array
 * All keys will be sorted in the `sortOrder` passed unless a key specific order
 * is set in the SortKey item.
 *
 * @typedef SortKey
 * @type (Array|Object)
 * @property {String} key - key name
 * @property {String} order ["ascending"|"descending"] - sort order for key
 *
 * @example
 *   ['priority', 'author', 'title'], 'ascending']
 * @example
 *   [['priority', 'ascending'], ['date','descending']]
 * @example
 *   [{ key:'priority', order:'ascending' }, { key:'date', order:'descending' }]
 *
 * @param  {Array<SortKey>}  sortKeys - key name and optional key specific sort order
 * @param  {String}  sortOrder - Default sort order, "ascending" or "descending"
 *
 * @return  {Number}  Comparison 1, 0, -1
 */
module.exports = (sortKeys = [], sortOrder = 'ascending') => {
  if (!sortKeys.length) return

  if (!['ascending', 'descending'].includes(sortOrder)) {
    throw new Error(`
      Invalid sort order "${sortOrder}" passed to sortByKeys,\n
      value of sortOrder argument must be either "ascending" or "descending".
    `)
  }

  /**
   * Helper to check if value is a valid date
   * @param {Any} value 
   * @returns {Boolean}
   */
  const isDate = (value) => {
    const date = new Date(value)
    return !!value && !isNaN(date.valueOf())
  }

  /**
   * Map the array of keys to set the sort `order` for each `key`,
   * allowing the array to be sorted by an ascending numeric property
   * and by a date property in descending order (most recent first).
   */
  sortKeys.map((item, index, array) => {
    const key = Array.isArray(item) ? item[0] : item.key || item
    const order = Array.isArray(item) ? item[1] : item.order || sortOrder
    array[index] = [key, order]
  })

  return (a, b) => {
    for (const [key, order] of sortKeys) {
      if (order === 'descending') [a, b] = [b, a]
      /**
       * Skip equivalent values
       */
      if (a[key] === b[key]) {
        continue
      }
      /**
       * Sort null and undefined values to the end of the list
       */
      switch (order) {
        case 'ascending':
          if (a[key] == null) {
            return 1
          }
          if (b[key] == null) {
            return -1
          }
          break
        case 'descending':
          if (a[key] == null) {
            return -1
          }
          if (b[key] == null) {
            return 1
          }
          break
        default:
          break
      }
      /**
       * Sort numbers
       */
      if (!isNaN(a[key]) && !isNaN(b[key])) {
        if (a[key] > b[key]) {
          return 1
        }
        if (a[key] < b[key]) {
          return -1
        }
      }
      /**
       * Sort dates
       */
      if (isDate(a[key]) && isDate(b[key])) {
        if (new Date(a[key]) > new Date(b[key])) {
          return 1
        }
        if (new Date(a[key]) < new Date(b[key])) {
          return -1
        }
      }
      /**
       * Sort strings
       */
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return a[key].localeCompare(b[key])
      }
    }
    return 0
  }
}
