const { html } = require('common-tags')

/**
 * Menu
 * 
 * This controlls the global table of contents for the publication, which is
 * available on all pages. For users with Javascript enabled, this menu is hidden
 * by default. Users with JS disabled will alwasy see the menu in its expanded state.
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 */
module.exports = function(eleventyConfig) {
  const citation = eleventyConfig.getFilter('citation')
  const copyright = eleventyConfig.getFilter('copyright')
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation')
  const linkList = eleventyConfig.getFilter('linkList')
  const menuHeader = eleventyConfig.getFilter('menuHeader')
  const menuList = eleventyConfig.getFilter('menuList')
  const menuResources = eleventyConfig.getFilter('menuResources')

  const { config, publication } = eleventyConfig.globalData
  const { resource_link: resourceLinks } = publication

  return function(params) {
    const { collections, pageData, publicationContributors } = params

    const footerLinks = resourceLinks.filter(({ type }) => type === 'footer-link')

    return html`
      <div
        class="quire-menu menu"
        role="banner"
        id="site-menu__inner"
      >
        ${menuHeader({ currentURL: pageData.url, publicationContributors })}
        <nav id="nav" class="quire-menu__list menu-list" role="navigation" aria-label="full">
          <h3 class="visually-hidden">Table of Contents</h3>
          <ul>${menuList({ navigation: eleventyNavigation(collections.menu) })}</ul>
        </nav>

        ${menuResources()}

        <div class="quire-menu__formats">
          <h6>Cite this Page</h6>
          <div class="cite-this">
            <span class="cite-this__heading">
              Chicago
            </span>
            <span class="cite-this__text">
            ${citation({ type: 'chicago', range: 'page', page: pageData })}
            </span>
          </div>

          <div class="cite-this">
            <span class="cite-this__heading">
              MLA
            </span>
            <span class="cite-this__text">
              ${citation({ type: 'mla', range: 'page', page: pageData })}
            </span>
          </div>
        </div>

        <footer class="quire-menu__footer" role="contentinfo">
          ${copyright({ config })}
          ${linkList({ links: footerLinks, classes: ["menu-list"]}) }
        </footer>
      </div>
    `
  }
}
