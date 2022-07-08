const { html } = require('~lib/common-tags')

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}
/**
 * Modal Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig, { page }) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const { imageDir } = eleventyConfig.globalData.config.params

  return function (figures=page.figures) {
    if (!figures) return;
    const figuresWithMarkdownifiedCaptions =
      figures.map((figure) => ({
        ...figure,
        caption: figure.caption ? markdownify(figure.caption) : null
      }));
    const serializedFigures = stringifyData(figuresWithMarkdownifiedCaptions);
    return html`
      <q-modal figures="${serializedFigures}" image-dir="${imageDir}"></q-modal>
    `;
  }
}
