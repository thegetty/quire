const { html } = require('~lib/common-tags')

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}

/**
 * Lightbox Tag
 * @todo add conditional rendering for epub and pdf when lightbox is included in `entry`
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
      figures.reduce((validFigures, figure) => {
        if (figure) {
          validFigures.push({
            ...figure,
            caption: figure.caption ? markdownify(figure.caption) : null
          })
        }
        return validFigures
      }, []);
    const serializedFigures = stringifyData(figuresWithMarkdownifiedCaptions);
    return html`
      <q-lightbox figures="${serializedFigures}" image-dir="${imageDir}"></q-lightbox>
    `;
  }
}
