/**
 * This controlls the global table of contents for the publication, which is
 * available on all pages. For users with Javascript enabled, this menu is hidden
 * by default. Users with JS disabled will alwasy see the menu in its expanded state.
 */
// const copyright = require('./copyright.11ty.js')
// const linkList = require('./link-list.html')

module.exports = function(eleventyConfig, globalData, data) {
  const menuHeader = eleventyConfig.getFilter('menuHeader')
  const menuList = eleventyConfig.getFilter('menuList')
  const menuResources = eleventyConfig.getFilter('menuResources')
  const { imageDir, page, pages, publication } = data

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
          <div class="cite-this" style="font-size: .857em; line-height: 1.5;">
          <span class="cite-this__heading" style="display: block; font-weight: bold; margin-top: 1em;">Chicago</span>
          <!--@TODO add cite-this include -->
          <span class="cite-this__text" style="user-select: all;"><!--{{  partial "cite-this.html" (dict "page" . "site" .Site "type" "chicago" "range" "page") }}--></span>
          </div>
          <div class="cite-this" style="font-size: .857em; line-height: 1.5;">
          <span class="cite-this__heading" style="display: block; font-weight: bold; margin-top: 1em;">MLA</span>
          <!--@TODO add cite-this include -->
          <span class="cite-this__text" style="user-select: all;"><!--{{  partial "cite-this.html" (dict "page" . "site" .Site "type" "mla" "range" "page") }}--></span>
          </div>
      </div>

      <footer class="quire-menu__footer" role="contentinfo">
        <!--
##        {{ partial "copyright.html" . }}

        -->
        <!--
          {{ if isset .Site.Data.publication "resource_link" -}}
          {{ $footerLinks := where .Site.Data.publication.resource_link "type" "footer-link" }}
          {{ if gt (len $footerLinks) 0 -}}
        -->
        <!--
##        {{- partial "link-list.html" $footerLinks -}}
        -->
        <!--
          {{- end -}}
          {{- end -}}
        -->
      </footer>
    </div>
  `
}
