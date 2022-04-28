const { html } = require('common-tags')

/**
 * Publication title block in menu
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 * @property   {String}  currentURL
 * @property   {Array|String}   contributors - publication contributors array or string override
 */
module.exports = function(eleventyConfig) {
  const contributorList = eleventyConfig.getFilter('contributorList')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  const { publication } = eleventyConfig.globalData
  const contributors = publication.contributor_as_it_appears || publication.contributor

  return function(params) {
    const { currentURL } = params
    const isHomePage = currentURL === '/'

    const homePageLinkOpenTag = isHomePage ? `<a class="quire-menu__header__title-link" href="/">` : ''
    const homePageLinkCloseTag = isHomePage ? `</a>` : ''

    const contributorElement = () => {
      if (typeof contributors === 'string') {
        return `${markdownify(contributors)}`
      } else if (Array.isArray(contributors)) {
        return `
          <span class="visually-hidden">Contributors: </span>
          ${contributorList({ contributors, type: 'primary' })}
        `
      } else {
        return ''
      }
    }

    return html`
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
}
