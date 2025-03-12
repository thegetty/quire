import chalkFactory from '#lib/chalk/index.js'

const logger = chalkFactory('filters:keywords')

/**
 * Gets the array of subject keywords defined in the publication data file
 *
 * @return {Array} An array of keyword strings
 */
export default function (eleventyConfig, { publication }) {
  if (!publication.subject) {
    logger.warn('the \'subject\' key is not defined in the \'publication\' data file')
    return ''
  }

  return publication.subject
    .filter(({ type }) => type === 'keyword')
    .map(({ name }) => name)
}
