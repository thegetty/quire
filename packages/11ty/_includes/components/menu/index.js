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
module.exports = function(eleventyConfig, params) {
  const citation = eleventyConfig.getFilter('citation')
  const copyright = eleventyConfig.getFilter('copyright')
  const linkList = eleventyConfig.getFilter('linkList')
  const menuHeader = eleventyConfig.getFilter('menuHeader')
  const menuList = eleventyConfig.getFilter('menuList')
  const menuResources = eleventyConfig.getFilter('menuResources')

  const { imageDir, pageData, pages, publication } = params

  const { contributor, contributor_as_it_appears, resource_link: resourceLinks } = publication

  const footerLinks = resourceLinks.filter(({ type }) => type === 'footer-link')

  const contributors = contributor_as_it_appears || contributor

  return html`
    <div
      class="quire-menu menu"
      role="banner"
      id="site-menu__inner"
    >
      ${menuHeader({ currentURL: pageData.url, contributors })}
      <nav id="nav" class="quire-menu__list menu-list" role="navigation" aria-label="full">
        <h3 class="visually-hidden">Table of Contents</h3>
        <ul>${menuList({ config, pages })}</ul>
      </nav>

      ${menuResources({ resourceLinks })}

      <div class="quire-menu__formats">
        <h6>Cite this Page</h6>
        <div class="cite-this">
          <span class="cite-this__heading">
            Chicago
          </span>
          <span class="cite-this__text">
          ${citation({ type: 'chicago', range: 'page', page: pageData, publication })}
          </span>
        </div>

        <div class="cite-this">
          <span class="cite-this__heading">
            MLA
          </span>
          <span class="cite-this__text">
            ${citation({ type: 'mla', range: 'page', page: pageData, publication })}
          </span>
        </div>
      </div>

      <footer class="quire-menu__footer" role="contentinfo">
        ${copyright({ config, publication })}
        ${linkList({ links: footerLinks, classes: ["menu-list"]}) }
      </footer>
    </div>
  `
}
