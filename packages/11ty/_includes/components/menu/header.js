const { html } = require('common-tags')

/**
 * Publication title block in menu
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 */
module.exports = function(eleventyConfig, data) {
  const contributorList = eleventyConfig.getFilter('contributorList')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const { page, publication } = data

  const { contributor, contributor_as_it_appears: contributorAsItAppears } = publication

  const home = '/'
  const isHomePage = page.url === home

  const homePageLinkOpenTag = isHomePage ? `<a class="quire-menu__header__title-link" href="${home}">` : ''
  const homePageLinkCloseTag = isHomePage ? `</a>` : ''

  const contributorElement = () => {
    if (!contributor && !contributorAsItAppears) return ''

    if (contributorAsItAppears) {
      return `${markdownify(contributorAsItAppears)}`
    } else if (contributor) {
      return `
        <span class="visually-hidden">Contributors: </span>
        ${contributorList(data, contributor, 'primary', 'string')}
      `
    }
  }

  return html`
    <header class="quire-menu__header">
      ${homePageLinkOpenTag}
        <h4 class="quire-menu__header__title">
          <span class="visually-hidden">Site Title: </span>
          ${siteTitle(data)}
        </h4>
      ${homePageLinkCloseTag}

      <div class="quire-menu__header__contributors">
        ${contributorElement(data)}
      </div>
    </header>
  `
}
