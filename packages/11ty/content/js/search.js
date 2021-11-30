import lunr from 'lunr'

export default class Search {
  constructor(data) {
    this.contentList = data
    this.index = this.buildIndex(data)
  }

  buildIndex(data) {
    return lunr(function () {
      this.field('content')
      this.field('title', { boost: 100 })
      this.field('url', { boost: 10 })
      this.ref('id')
      data.forEach((item) => this.add(item))
    })
  }

  // Return results in order of relevance
  search(query) {
    const results = this.index.search(query)
    return results.map((result) => this.contentList[result.ref])
  }
}
