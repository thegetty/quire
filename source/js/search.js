import lunr from 'lunr';

class Search {
  constructor(data) {
    this.index = this.buildIndex(data);
    this.contentList = data;
  }

  buildIndex(data) {
    return lunr(function () {
      this.field('title', {
        boost: 100
      });
      this.field('url', {
        boost: 10
      });
      this.field('content');
      this.ref('id');
      data.forEach(item => {
        this.add(item);
      });
    });
  }

  // Return results in order of relevance
  search(query) {
    let results = this.index.search(query);
    return results.map((result) => {
      return this.contentList[result.ref];
    });
  }
}

export default Search
;