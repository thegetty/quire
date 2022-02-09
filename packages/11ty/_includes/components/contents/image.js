const path = require('path')
/**
 * Renders a TOC item image
 *
 * @param  {Object} context
 * @param  {String} imageDir - image directory from eleventyComputed
 * @param  {String} src - image src
 *
 * @return {String} TOC image markup
 */
module.exports = function(eleventyConfig, data) {
  const { imageDir, src } = data
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
