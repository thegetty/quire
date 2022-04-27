const { html } = require('common-tags')

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}
/**
 * Modal Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const { imageDir } = globalData.config.params

  return function () {
    const figuresWithMarkdownifiedCaptions =
      globalData.figures.figure_list.map((figure) => ({
        ...figure,
        caption: figure.caption ? markdownify(figure.caption) : null
      }));
    const serializedFigures = stringifyData(figuresWithMarkdownifiedCaptions);
    return html`
      <q-modal figures="${serializedFigures}" image-dir="${imageDir}"></q-modal>
    `;
  }
}
