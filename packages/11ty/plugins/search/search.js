import lunr from 'lunr'

/**
 * A full-text search module that implements methods to build and query an index of content.
 *
 * @class      Search
 */
export default class Search {
  constructor(data) {
    this.contentList = data
    this.index = this.buildIndex(data)
  }

  /**
   * Construct the content index
   *
   * @param      {Array}  data    An array of items to index
   * @return     {Object}  An index of the content
   */
  buildIndex(data) {
    return lunr(function() {
      this.field('abstract')
      this.field('content')
      this.filed('contributor')
      this.field('subtitle', { boost: 90 })
      this.field('title', { boost: 100 })
      this.field('url', { boost: 10 })
      this.ref('id')
      data.forEach((item) => this.add(item))
    })
  }

  /**
   * Query the index of for the provided string or terms
   *
   * @param      {String}  query   Terms for which to search
   * @return     {Array}  An array of result objects
   */
  search(query) {
    const results = this.index.search(query)
    return results.map((result) => this.contentList[result.ref])
  }
}
