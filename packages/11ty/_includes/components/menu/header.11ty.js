/*
 * Publication title block in menu
 */

module.exports = function(eleventyConfig, { publication }, page) {
  const contributorList = eleventyConfig.getFilter('contributorList')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

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
        ${contributorList(contributor, 'primary', 'string')}
      `
    }
  }

  return `
    <header class="quire-menu__header">
      ${homePageLinkOpenTag}
        <h4 class="quire-menu__header__title">
          <span class="visually-hidden">Site Title: </span>
          ${siteTitle()}
        </h4>
      ${homePageLinkCloseTag}

      <div class="quire-menu__header__contributors">
        ${contributorElement()}
      </div>
    </header>
  `
}
