/**
 * Renders a list of contributors with options
 * Used across MLA and Chicago formats
 * 
 * @param     {Object}  eleventyConfig
 * @param     {Object}  params
 * @property  {Array}   contributors
 * @param     {Object}  options
 * @property  {Boolean} reverse If true, returns family name before surname
 * @property  {Number}  max The maximum number of contributors who will be listed by name. 
 * If there are more than the max, ", et al" will be appended.
 * @property  {String}  separator The separator that will be used to join names
 * 
 * @return {String}
 */
module.exports = function(eleventyConfig, params, options = {}) {
  const { contributors } = params
  if (!Array.isArray(contributors)) return ''
    
  const fullname = eleventyConfig.getFilter('fullname')
  const getContributor = eleventyConfig.getFilter('getContributor')

  contributors = contributors.map((item) => item.id ? getContributor(item.id) : item)

  let pageContributors = []

  for (const [i, contributor] of contributors.entries()) {
    if (i <= options.max) {
      pageContributors.push(fullname(contributor, { reverse: options.reverse }))
    }
    if (contributors.length === 1) {
      pageContributors = pageContributors.join('')
    }
    if (i === 1) {
      pageContributors = pageContributors.join(options.separator)
    }
    if (contributors.length > options.max) {
      pageContributors+=', et al'
    }
    if (i === options.max) break
  }

  return pageContributors.replace(/\.$/, '')
}
