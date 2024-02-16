import chalkFactory from '#lib/chalk/index.js'

const logger = chalkFactory('plugins:collections')

/**
 * Sort method applied to pages in collections
 * @param {Object} a and b are page objects
 */
export default (a, b) => {
  if (a.data.order === b.data.order) {
    logger.warn(`"${a.inputPath}" and "${b.inputPath}" have identical values for the front-matter property "order" and may not sort as expected.`)
  }
  return a.data.order - b.data.order
}
