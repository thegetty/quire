import lunr from 'lunr'

/**
 * A full-text search module that implements methods to build and query an index of content.
 *
 * @class      Search
 */
export default class Search {
  constructor(data) {
    this.contentList = data
    this.index = lunr.Index.load(data)
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
