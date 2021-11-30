const lunr = require('lunr')

/**
 * Creates lunr index
 * @todo transform values, see: search-index.html
 * 
 * @param  {Object} collection 
 * @return {Array}             JSON search index of pages in collection
 */
module.exports = function (collection) {
  const index = lunr(function () {
    this.field('abstract')
    this.field('content')
    this.field('contributor')
    this.field('subtitle')
    this.field('title')
    this.field('url')
    collection.forEach((page) => {
      this.add({
        abstract: page.template.frontMatter.data.abstract,
        content: page.content,
        contributor: page.template.frontMatter.data.contributor,
        id: page.url,
        subtitle: page.template.frontMatter.data.subtitle,
        title: page.template.frontMatter.data.title,
        url: page.url
      });
    });
  });

  return index.toJSON()
}
