const chalkFactory = require('~lib/chalk')
const fs = require('fs-extra')
const path = require('path')
const logger = chalkFactory('Search Index')

/**
 * Write JSON index of page content in `collections.html`
 *
 * @param   {Object}  collections
 * @return     {Object}  Page content index JSON
 */
module.exports = function(collections) {
  const wordcount = (content) => {
    if (!content) return 0
    return content.split(' ').length
  }

  const contentIndex = collections.html.map(({ data, templateContent, url }) => {
    return {
      abstract: data.abstract,
      content: templateContent,
      contributor: data.contributor,
      length: wordcount(templateContent),
      subtitle: data.subtitle,
      title: data.title,
      type: data.layout,
      url
    }
  })

  const outputDir = process.env.ELEVENTY_ENV === 'production' ? 'public' : '_site'
  const outputPath = path.join(outputDir, 'search-index.json')

  try {
    fs.ensureDirSync(path.parse(outputPath).dir)
    fs.writeJsonSync(outputPath, contentIndex)
  } catch(error) {
    logger.error(error)
  }
}
