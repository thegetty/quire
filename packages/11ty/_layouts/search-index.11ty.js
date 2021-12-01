module.exports = function ({ pages }) {
  return JSON.stringify(
    pages.map((page) => {
      return {
        abstract: page.data.abstract,
        contributor: page.data.contributor,
        content: page.data.content,
        length: page.data.content.split(' ').length, // @todo replace with a real wordcount if wordcount is necessary
        subtitle: page.data.subtitle,
        title: page.data.title,
        type: page.data.layout,
        url: page.url,
      }
    })
  )
}
