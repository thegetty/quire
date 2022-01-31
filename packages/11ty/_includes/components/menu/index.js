/**
 * Menu
 * 
 * This controlls the global table of contents for the publication, which is
 * available on all pages. For users with Javascript enabled, this menu is hidden
 * by default. Users with JS disabled will alwasy see the menu in its expanded state.
 *
 * @param  {Object} context
 * @param  {Object} eleventyComputed data
 * 
 * @return {String} Menu header markup
 */
module.exports = function({ eleventyConfig, globalData, page }, eleventyComputed) {
  const citation = eleventyConfig.getFilter('citation')
  const copyright = eleventyConfig.getFilter('copyright')
  const menuHeader = eleventyConfig.getFilter('menuHeader')
  const linkList = eleventyConfig.getFilter('linkList')
  const menuList = eleventyConfig.getFilter('menuList')
  const menuResources = eleventyConfig.getFilter('menuResources')


  const { publication } = globalData
  const { imageDir, pageData, pages } = eleventyComputed

  const footerLinks = publication.resource_link.filter(({ type }) => type === 'footer-link')

  return `
    <div
      class="quire-menu menu"
      role="banner"
      id="site-menu__inner"
    >
      ${menuHeader(page)}
      <nav id="nav" class="quire-menu__list menu-list" role="navigation" aria-label="full">
        <h3 class="visually-hidden">Table of Contents</h3>
        <ul>${menuList(pages)}</ul>
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
        ${copyright()}
        ${linkList(footerLinks, ["menu-list"]) }
      </footer>
    </div>
  `
}
