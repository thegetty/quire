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

  buildIndex(pages) {
    return lunr(function () {
      this.field('abstract')
      this.field('content')
      this.field('contributor')
      this.field('subtitle')
      this.field('title')
      this.field('url')
      this.ref('url')
      pages.forEach((page) => {
        this.add(page)
      })
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
    return results.map((result) => this.contentList.find(({url}) => url === result.ref))
  }
}
