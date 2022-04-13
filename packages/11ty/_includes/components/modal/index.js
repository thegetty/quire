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
  const { imageDir } = globalData.config.params

  return function () {
    const figures = stringifyData(globalData.figures.figure_list);
    return html`
      <q-modal figures="${figures}" image-dir="${imageDir}"></q-modal>
    `;
  }
}
