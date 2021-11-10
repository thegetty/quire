/*
 * Complete title block for publication.
 */
const siteTitle = require('./site-title.11ty.js')

module.exports = function(data) {
  return `
    <header class="quire-menu__header">
      {{ if ne .Kind "home" -}}
      <a class="quire-menu__header__title-link" href="{{ .Site.BaseURL | relURL }}">
      {{- end }}
      <h4 class="quire-menu__header__title">
        <span class="visually-hidden">Site Title: </span>
        ${siteTitle(data)}
      </h4>
      {{ if ne .Kind "home" -}}
      </a>
      {{- end }}
      {{- if .Site.Data.publication.contributor_as_it_appears -}}
        <div class="quire-menu__header__contributors">
        {{ .Site.Data.publication.contributor_as_it_appears | markdownify }}
        </div>
      {{ else if .Site.Data.publication.contributor }}
        <div class="quire-menu__header__contributors">
        <span class="visually-hidden">Contributors: </span>
        {{ partial "contributor-list.html" (dict "range" .Site.Data.publication.contributor "contributorType" "primary" "listType" "string" "Site" $.Site) }}
        </div>
      {{- end }}
    </header>
  `
}
