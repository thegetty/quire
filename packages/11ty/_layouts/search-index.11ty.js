/**
 * Layout for JSON index of page content
 *
 * @param      {Object}  context
 * @property   {Object}  collections
 * @return     {Object}  Page content index JSON
 */
module.exports = function({ collections }) {
  /**
   * @todo replace length with real wordcount
   */
  const wordcount = (content) => {
    if (!content) return 0
    return content.split(' ').length
  }

  const contentIndex = collections.html.map(({ data, url }) => ({
    abstract: data.abstract,
    content: data.content,
    contributor: data.contributor,
    length: wordcount(data.content),
    subtitle: data.subtitle,
    title: data.title,
    type: data.layout,
    url
  }))

  return JSON.stringify(contentIndex)
}
