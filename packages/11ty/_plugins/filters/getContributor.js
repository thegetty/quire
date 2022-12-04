const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('filters:getContributor')

/**
 * Looks up a contributor in publication.yaml[contributor] by id
 * @param  {Object} eleventyConfig
 * @param  {Object} contributor
 * @return {Object}                contributor
 */
module.exports = function (eleventyConfig, item) {
  if (!item) return ''

  // If contributor object is defined on the page, return it
  if (item.full_name || (item.first_name && item.last_name)) {
    return item
  }

  // Look up contributor by id in `publication` global data
  const { publication } = eleventyConfig.globalData
  const contributor = publication.contributor.find(
    (contributor) => contributor.id === item.id
  )

  if (!contributor) {
    logger.error(`Contributor not found in 'publication.yaml.' Contributor: `, item)
    return ''
  }
  return contributor
}
