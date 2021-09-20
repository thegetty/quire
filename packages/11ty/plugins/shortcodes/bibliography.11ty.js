/*
This shortcode generates a bibliography from the entries in the project's
`references.yml` file.

By default, the bibliography will be sorted by each entry’s `full` value.
However, this can be overridden by including a `sort` value on any
individual entries that you want sorted otherwise.

Also, in `config.yml` the `displayBiblioShort` property can be set to "true"
to display both the short and the full bibliography values in the output.
Without this property set, the bibliography will not include the short form.

{{- range $.Site.Data.references.entries -}}

  {{- $bibFull := .full -}}
  
  {{- $bibShort := "" -}}
  {{ if .short }}
    {{- $bibShort = .short -}}
  {{ else }}
    {{- $bibShort = .id -}}
  {{ end }}
  
  {{- $bibSort := "" -}}
  {{ if .sort }}
    {{- $bibSort = .sort -}}
  {{ else }}
    {{- $bibSort = .full -}}
  {{ end }}  
  {{- $bibSort = $bibSort | truncate 100 | urlize -}} 
     
  {{- $.Page.Scratch.SetInMap "ref" "0" $bibShort -}}
  {{- $.Page.Scratch.SetInMap "ref" "1" $bibFull -}}
  {{- $ref := ($.Page.Scratch.GetSortedMapValues "ref") -}}
  {{- $.Page.Scratch.SetInMap "biblio" $bibSort $ref -}}  
  {{- $.Page.Scratch.Delete "ref" -}}
  
*/
  
/**
 * { function_description }
 *
 * @param      {<type>}   content  The content
 * @param      {<type>}   data     The data
 *
 * @return     {boolean}  { description_of_the_return_value }
 */
module.exports = (data) => {
  const slugify = eleventyConfig.getFilter('slugify')

  return params.displayBiblioShort
    ? `<dl>
        <dt><span id="${data.index}">${data.biblio[0]}</span></dt>
        <dd>${data.biblio[1]}</dd>
      </dl>`
    : `<div class="quire-page__content__references">
        <ul>
          <li id="${data.index}">${data.biblio[1]}</li>
        </ul>
      </div>`
}
