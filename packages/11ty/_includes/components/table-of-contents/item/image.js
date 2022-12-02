const path = require('path')
/**
 * Renders a TOC item image
 *
 * @param     {Object} eleventyConfig
 * @param     {Object} params
 * @property  {String} src - image src
 *
 * @return {String} TOC image markup
 */
module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.figures
  return function(params) {
    const { src } = params
    if (!imageDir || !src) return ''
    const imgPath = path.join(imageDir, src)
    return `
      <div class="card-image">
        <figure class="image">
          <img src="${ imgPath }" alt="" />
        </figure>
      </div>
    `
  }
}
