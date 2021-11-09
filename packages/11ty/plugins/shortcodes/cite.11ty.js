const { oneLine } = require('common-tags')

/**
 *  This shortcode adds a linked Author Date citation reference to the text, and a
 *  hover pop-up with the full citation text. Example:
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
 *  @todo fix icon not rendering
 *  @todo handle page-level sorted bibliography (likely in a different component or shortcode)
 *  @todo markdownify citation content
 */
module.exports = function(eleventyConfig, { config, references }, id, page, year) {
  if (!id) {
    console.warn('1, 2 or 3 values must be supplied with this shortcode. The first is required and should match a short reference in the project’s `references.yml` file, the second is optional, and should be a page number or range of page numbers, the third is optional and should be the text to appear in the link if not the full short form of the reference" "example" "{% qcite &#34;Faure 1909&#34; &#34;304&#34; &#34;1909&#34; %}')
    return ''
  }

  const cited = references[id]

  if (!cited) {
    console.warn('The id supplied doesn’t match one in the project’s `references.yml` file" "example" "{{< q-cite &#34;Faure 1909&#34; >}}<br /><br />id: &#34;Faure 1909&#34;')
    return ''
  }

  let buttonText = (year) ? year : cited.short || id
  if (page) buttonText += config.params.citationPageLocationDivider + page

  const button = config.params.citationPopupStyle === 'icon'
    ? `${buttonText}
        <button class="quire-citation__button material-icons md-18 material-control-point" aria-expanded="false">
          control_point
        </button>`
    : 
    `<span class="quire-citation__button" role="button" tabindex="0" aria-expanded="false">
      ${buttonText}
    </span>`

  return oneLine `
    <span class="quire-citation expandable">
      ${button}
      <span class="quire-citation__content">
        <span class="visually-hidden">Citation:&nbsp;</span>
        ${cited.full}
      </span>
    </span>
  `
}
