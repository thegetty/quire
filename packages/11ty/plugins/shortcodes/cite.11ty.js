/**
 *  This shortcode adds a linked Author Date citation reference to the text, and a
 *  hover pop-up with the full citation text. It also adds the citation to a map
 *  of cited works, which can then be output as a page-level bibliography on essay
 *  and entry type pages. Example:
 *
 *  {{< q-cite "Faure 1909" "54" >}}
 *
 *  The first positional parameter is a short form citation that should match one
 *  in `references.yml`. The second, optional parameter is a page reference. The
 *  above sample would output as: Faure 1909, 54.
 *
 *  A third optional parameter allows you to customize the text to appear in the
 *  link if not the short form of the citation. The following sample would appear
 *  simply as: 1909, 54.
 *
 *  {{< q-cite "Faure 1909" "54" "1909" >}}
 *
 *  In using this third parameter, you still need to have the second parameter
 *  even if it’s empty. The following sample would appear simply as: 1909.
 *
 *  {{< q-cite "Faure 1909" "" "1909" >}}
 *
 *  The text element between the author date reference and the page can be changed
 *  with the `citationPageLocationDivider` property in `config.yml`.
 *
 */

/*
{{- $errorMissingValue := dict "shortcode" "q-cite" "message" "1, 2 or 3 values must be supplied with this shortcode. The first is required and should match a short reference in the project’s `references.yml` file, the second is optional, and should be a page number or range of page numbers, the third is optional and should be the text to appear in the link if not the full short form of the reference" "example" "{{< q-cite &#34;Faure 1909&#34; &#34;304&#34; &#34;1909&#34; >}}" -}}

{{- $errorMissingReference := dict "shortcode" "q-cite" "message" "The id supplied doesn’t match one in the project’s `references.yml` file" "example" "{{< q-cite &#34;Faure 1909&#34; >}}<br /><br />id: &#34;Faure 1909&#34;" -}}

  @todo grab data from site.data.references.entries
  @todo refactor button
  @todo fullCitation | shortCitation
  @todo "error-message.html" $errorMissingReference
  @todo markdownify citation content
  @todo ${site.params.citationPageLocationDivider}
*/
module.exports = function(eleventyConfig, data) {
  // const button = site.Params.citationPopupStyle === 'icon'
  //   ? `<span class="quire-citation__button" role="button" tabindex="0" aria-expanded="false">
  //       <button class="quire-citation__button material-icons md-18 material-control-point" aria-expanded="false">control_point</button>
  //     </span>`
  //   : ''

  const content = data

  return `
    <span class="quire-citation expandable">
      <span class="quire-citation__content">
        <span class="visually-hidden">Citation:&nbsp;</span>
        ${content}
      </span>
    </span>
  `.trim()
}
