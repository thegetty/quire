const { html } = require('~lib/common-tags')

/**
 * Publication title block in menu
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 * @property   {String}  currentURL
 * @property   {Array|String}   contributors - publication contributors array or string override
 */
module.exports = function(eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const siteTitle = eleventyConfig.getFilter('siteTitle')
  const { contributor: publicationContributors, contributor_as_it_appears } = eleventyConfig.globalData.publication

  return function(params) {
    const { currentURL } = params
    const isHomePage = currentURL === '/'

    const homePageLinkOpenTag = isHomePage ? '' : `<a class="quire-menu__header__title-link" href="/">`
    const homePageLinkCloseTag = isHomePage ? '' : `</a>`

    const contributorContent = contributor_as_it_appears || contributors({ context: publicationContributors, format: 'string', type: 'primary' })

    const contributorElement = contributorContent
      ? `<span class="visually-hidden">Contributors: </span>${contributorContent}`
      : ''

    return html`
      <header class="quire-menu__header">
        ${homePageLinkOpenTag}
          <h4 class="quire-menu__header__title">
            <span class="visually-hidden">Site Title: </span>
            ${siteTitle()}
          </h4>
        ${homePageLinkCloseTag}

        <div class="quire-menu__header__contributors">
          ${contributorElement}
        </div>
      </header>
    `
  }
}
