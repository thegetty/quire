/*
 * Complete title block for publication.
 */
const siteTitle = require('./site-title.11ty.js')

module.exports = function(data) {
  const { page, publication } = data
  const { contributor, contributor_as_it_appears: contributorAsItAppears } = publication

  const home = '/'
  const isHomePage = page.url === home

  const homePageLinkOpenTag = isHomePage ? `<a class="quire-menu__header__title-link" href="${home}">` : ''
  const homePageLinkCloseTag = isHomePage ? `</a>` : ''

  // @TODO figure out js module-friendly filters @see ./nav-bar.11ty.js
  const markdownify = (input) => input ? input : ''

  const contributorMarkup = () => {
    if (!contributor && !contributorAsItAppears) return ''

    if (contributorAsItAppears) {
      return `${markdownify(contributorAsItAppears)}`
    } else if (contributor) {
      return `
        <span class="visually-hidden">Contributors: </span>
        <!--@TODO add updated contributor-list include-->
        <!--{{ partial "contributor-list.html" (dict "range" .Site.Data.publication.contributor "contributorType" "primary" "listType" "string" "Site" $.Site) }}-->
      `
    }
  }

  return `
    <header class="quire-menu__header">
      ${homePageLinkOpenTag}
        <h4 class="quire-menu__header__title">
          <span class="visually-hidden">Site Title: </span>
          ${siteTitle(data)}
        </h4>
      ${homePageLinkCloseTag}

      <div class="quire-menu__header__contributors">
        ${contributorMarkup()}
      </div>
    </header>
  `
}
