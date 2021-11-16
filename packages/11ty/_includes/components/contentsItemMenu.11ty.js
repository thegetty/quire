module.exports = function({ config }, page) {
  let pageTitle = page.data.label ? page.data.label+config.params.pageLabelDivider : ''
  pageTitle += page.data.short_title || page.data.title
  return `      
    <a href="${page.url}">${pageTitle}</a>
  `
}