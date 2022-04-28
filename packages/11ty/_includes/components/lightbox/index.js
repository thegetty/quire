const { html } = require('common-tags')

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}

/**
 * Lightbox Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig, globalData) {
  return function () {
    const figures = stringifyData(globalData.figures.figure_list);
    return html`
      <q-lightbox debug figures="${figures}"></q-lightbox>
    `;
  }
}
