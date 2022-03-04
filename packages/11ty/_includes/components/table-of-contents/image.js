const path = require('path')
/**
 * Renders a TOC item image
 *
 * @param     {Object} eleventyConfig
 * @param     {Object} globalData
 * @param     {Object} params
 * @property  {String} imageDir - image directory from eleventyComputed
 * @property  {String} src - image src
 *
 * @return {String} TOC image markup
 */
module.exports = function(eleventyConfig, globalData) {
  return function(params) {
    const { imageDir, src } = params
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
