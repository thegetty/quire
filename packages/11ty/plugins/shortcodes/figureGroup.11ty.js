const { html } = require('common-tags')
const example = "{% qfiguregroup 2, '3.1, 3.2, 3.3' %}"

/**
 * Render multiple <figure> elements in a group
 *
 * @param      {Object}  eleventyConfig  The eleventy configuration
 * @param      {Object}  figures         The figures
 * @param      {Array<id>}  ids             The identifiers
 * @return     {String}  An HTML string of the element to render
 */
module.exports = function (eleventyConfig, figures, columns, ids) {
  // const figure = eleventyConfig.getFilter('qfigure')

  ids = ids ? ids.split(',') : []

  if (!ids.length) {
    console.warn(`Error: NoId: the q-figures shortcode must include one or more 'id' values that correspond to an 'id' in the 'figures.yaml' file. @example ${example}`)
  }

  // if (ErrorBadId) {
  //   console.warn(`Error: ErrorBadId: One or more of the 'id' values supplied to the q-figures shortcode do not match any 'id' values in the 'figures.yaml' file. @example ${example}`)
  // }

  // if (ErrorNoMediaType) {
  //   console.warn(`Error: NoMediaType: One of the figures passed to the q-figures shortcode is missing the 'media_type' attribute. Figures in 'figures.yaml' must be have a 'media_type' attribute with a value of either  "vimeo" or "youtube"`)
  // }

  const figureTags = (ids) => {
    const output = ``
    ids.forEach((id) => output + eleventyConfig.javascriptFunctions.figure(eleventyConfig, figures, id))
    return output
  }

  return html `
    <div class="quire-figure-group__row columns">
      ${figureTags}
    </div>
  `
}
