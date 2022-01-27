const { html } = require('common-tags')

/**
 * Render multiple <figure> elements in a group
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  globalData      Eleventy global data
 * @param      {Array<id>}  ids          An array or list of figure identifiers
 * @return     {String}  An HTML string of the elements to render
 */
module.exports = function (context, { columns, ids=[] }) {
  const { eleventyConfig } = context
  const figure = eleventyConfig.getFilter('qfigure')

  columns = parseInt(columns)

  /**
   * Parse the ids arg for figure identifiers
   * The ids arg can be either a string of comma separated figure ids,
   * @example 'fig-1, fig-2, fig-3'
   * or an array of identifier strings
   * @example ['fig-1', 'fig-2', 'fig-3']
   */
  ids = Array.isArray(ids) ? ids : ids.split(',').map((id) => id.trim())

  if (!ids.length) {
    console.warn(`Error: NoId: the q-figures shortcode must include one or more 'id' values that correspond to an 'id' in the 'figures.yaml' file. @example {% qfiguregroup columns=2, ids='3.1, 3.2, 3.3' %}`)
  }

  // if (ErrorNoMediaType) {
  //   console.warn(`Error: NoMediaType: One of the figures passed to the q-figures shortcode is missing the 'media_type' attribute. Figures in 'figures.yaml' must be have a 'media_type' attribute with a value of either  "vimeo" or "youtube"`)
  // }

  const classes = ['column', 'q-figure--group__item', `quire-grid--${columns}`]
  const rows = Math.ceil(ids.length / columns)
  let figureTags = []
  for (let i=0; i < rows; ++i) {
    const startIndex = i * columns
    const row = ids.slice(startIndex, columns + startIndex)
      .reduce((output, id) => output + figure({ id, class: classes }), '')
    figureTags.push(`<div class="q-figure--group__row columns">${row}</div>`)
  }

  return html`
    <figure class="q-figure q-figure--group">
      ${figureTags.join('\n')}
    </figure>
  `
}
